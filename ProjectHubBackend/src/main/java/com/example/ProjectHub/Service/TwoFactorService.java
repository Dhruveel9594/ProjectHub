package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.dto.TwoFactorSetupResponse;
import com.example.ProjectHub.entity.User;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class TwoFactorService {

    @Autowired
    private UserRepo userRepo;

    /**
     * GoogleAuthenticator configured with a window size of 3.
     *
     * Window size 3 means codes from [T-1, T, T+1] are accepted,
     * where T is the current 30-second TOTP window.
     *
     * This tolerates up to ~30 seconds of clock drift on either side
     * without compromising security meaningfully — Google/GitHub use
     * the same window.
     *
     * FIX: Previously used default constructor (window=0 → only exact
     * current window accepted). This caused "always invalid" errors
     * when device clock drifted even a few seconds past a window boundary.
     */
    private final GoogleAuthenticator gAuth = new GoogleAuthenticator(
            new GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder()
                    .setWindowSize(3)
                    .setTimeStepSizeInMillis(TimeUnit.SECONDS.toMillis(30))
                    .build()
    );

    private static final long SESSION_TTL_MS = 5 * 60 * 1000L; // 5 minutes

    /**
     * Temporary in-memory session store: tempToken → TempSession.
     *
     * In production replace with Redis (TTL-based expiry is automatic there).
     * This ConcurrentHashMap is safe for multi-threaded Spring beans but
     * does NOT survive restarts and does NOT work across multiple instances.
     */
    private final Map<String, TempSession> tempSessions = new ConcurrentHashMap<>();

    // ─────────────────────────────────────────────────────────────────────────
    //  SETUP — Step 1: Generate secret + QR code
    //  Called when user clicks "Enable 2FA" in settings.
    //  Does NOT enable 2FA — only saves the secret.
    //  2FA is enabled only after confirmSetup() succeeds.
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional
    public TwoFactorSetupResponse setupTwoFactor() {
        User user = getLoggedInUser();

        if (user.isTwoFactorEnabled()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "2FA is already enabled for this account");
        }

        // FIX: Always regenerate the secret during setup, even if one already
        // exists. A previous failed/abandoned setup leaves a stale secret that
        // would cause confirmSetup() to fail with a different QR code.
        GoogleAuthenticatorKey credentials = gAuth.createCredentials();
        String secret = credentials.getKey();

        user.setTwoFactorSecret(secret);
        user.setTwoFactorEnabled(false);   // Not enabled until confirmed
        user.setTwoFactorVerified(false);
        userRepo.save(user);

        String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(
                "ProjectHub",
                user.getEmail(),
                credentials
        );

        return new TwoFactorSetupResponse(secret, generateQrCodeBase64(qrUrl));
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  SETUP — Step 2: Confirm setup with first code
    //  User scans QR, enters 6-digit code; we verify and flip enabled=true.
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional
    public void confirmSetup(String codeStr) {
        // FIX: Accept code as String, parse here — avoids Jackson deserializing
        // "007890" as integer 7890 which then fails the 6-digit check.
        int code = parseCode(codeStr);
        User user = getLoggedInUser();

        if (user.getTwoFactorSecret() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "2FA setup not initiated. Call /setup first.");
        }

        if (user.isTwoFactorEnabled()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "2FA is already enabled for this account.");
        }

        boolean valid = gAuth.authorize(user.getTwoFactorSecret(), code);
        if (!valid) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid 2FA code. Ensure your device time is synced correctly.");
        }

        user.setTwoFactorEnabled(true);
        user.setTwoFactorVerified(true);
        userRepo.save(user);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  DISABLE 2FA — Must provide current valid code
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional
    public void disableTwoFactor(String codeStr) {
        int code = parseCode(codeStr);
        User user = getLoggedInUser();

        if (!user.isTwoFactorEnabled()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "2FA is not enabled for this account");
        }

        boolean valid = gAuth.authorize(user.getTwoFactorSecret(), code);
        if (!valid) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid 2FA code. Cannot disable 2FA.");
        }

        user.setTwoFactorEnabled(false);
        user.setTwoFactorVerified(false);
        user.setTwoFactorSecret(null);
        userRepo.save(user);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  LOGIN STEP 2 — Verify 6-digit code after temp token was issued
    // ─────────────────────────────────────────────────────────────────────────

    public boolean verifyCode(String username, String codeStr) {
        int code = parseCode(codeStr);

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "2FA is not enabled for this user");
        }

        return gAuth.authorize(user.getTwoFactorSecret(), code);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  TEMP TOKEN — Issued after password check passes; before 2FA check
    // ─────────────────────────────────────────────────────────────────────────

    public String createTempToken(String username) {
        String tempToken = UUID.randomUUID().toString();
        tempSessions.put(tempToken, new TempSession(username));
        cleanupExpiredSessions();
        return tempToken;
    }

    /**
     * Validates and returns the username for a tempToken.
     * Throws 401 if expired or not found.
     */
    public String getUsernameFromTempToken(String tempToken) {
        TempSession session = tempSessions.get(tempToken);

        if (session == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Session expired or invalid. Please login again.");
        }

        if (System.currentTimeMillis() - session.createdAt > SESSION_TTL_MS) {
            tempSessions.remove(tempToken);
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "2FA session expired. Please login again.");
        }

        return session.username;
    }

    public void removeTempToken(String tempToken) {
        tempSessions.remove(tempToken);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Parse a TOTP code from String → int.
     *
     * FIX: JSON integers lose leading zeros (e.g. "007890" → 7890).
     * Accepting as String and trimming whitespace prevents silent mismatches.
     */
    private int parseCode(String codeStr) {
        if (codeStr == null || codeStr.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "2FA code is required");
        }
        try {
            return Integer.parseInt(codeStr.trim());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid 2FA code format");
        }
    }

    private String generateQrCodeBase64(String qrUrl) {
        try {
            QRCodeWriter qrWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrWriter.encode(qrUrl, BarcodeFormat.QR_CODE, 200, 200);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return "data:image/png;base64,"
                    + Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate QR code");
        }
    }

    private User getLoggedInUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private void cleanupExpiredSessions() {
        long cutoff = System.currentTimeMillis() - SESSION_TTL_MS;
        tempSessions.entrySet().removeIf(e -> e.getValue().createdAt < cutoff);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Inner class
    // ─────────────────────────────────────────────────────────────────────────

    private static class TempSession {
        final String username;
        final long createdAt;

        TempSession(String username) {
            this.username = username;
            this.createdAt = System.currentTimeMillis();
        }
    }
}