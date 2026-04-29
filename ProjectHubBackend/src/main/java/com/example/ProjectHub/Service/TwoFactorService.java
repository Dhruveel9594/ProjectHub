package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.dto.TwoFactorSetupResponse;
import com.example.ProjectHub.entity.User;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.warrenstrange.googleauth.GoogleAuthenticator;
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
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TwoFactorService {

    @Autowired
    private UserRepo userRepo;

    // GoogleAuthenticator handles TOTP generation and verification
    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();

    // Temporary token store — maps tempToken → username
    // Valid for 5 minutes. Used between login step 1 and step 2.
    // In production, replace this with Redis for scalability
    private final Map<String, TempSession> tempSessions = new ConcurrentHashMap<>();

    // ─────────────────────────────────────────────────────────
    //  SETUP — Step 1: Generate secret + QR code
    //  Called when user clicks "Enable 2FA" in settings
    // ─────────────────────────────────────────────────────────
    @Transactional
    public TwoFactorSetupResponse setupTwoFactor() {
        User user = getLoggedInUser();

        if (user.isTwoFactorEnabled()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "2FA is already enabled for this account");
        }

        // Generate a new TOTP secret key
        GoogleAuthenticatorKey credentials = gAuth.createCredentials();
        String secret = credentials.getKey();

        // Save secret to user — but don't enable 2FA yet
        // 2FA is only enabled after user successfully scans and verifies
        user.setTwoFactorSecret(secret);
        user.setTwoFactorVerified(false);
        userRepo.save(user);

        // Generate QR code URL for Google Authenticator
        // Format: otpauth://totp/AppName:username?secret=SECRET&issuer=AppName
        String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(
                "ProjectHub",      // issuer name shown in authenticator app
                user.getEmail(),   // account name shown in authenticator app
                credentials
        );

        // Convert QR URL to a PNG image (base64 encoded)
        String qrBase64 = generateQrCodeBase64(qrUrl);

        return new TwoFactorSetupResponse(secret, qrBase64);
    }

    // ─────────────────────────────────────────────────────────
    //  SETUP — Step 2: Verify first code to confirm setup
    //  User scans QR code then enters the 6-digit code
    // ─────────────────────────────────────────────────────────
    @Transactional
    public void confirmSetup(int code) {
        User user = getLoggedInUser();

        if (user.getTwoFactorSecret() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "2FA setup not initiated. Call /setup first.");
        }

        // Verify the code against the secret
        boolean valid = gAuth.authorize(user.getTwoFactorSecret(), code);

        if (!valid) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Invalid 2FA code. Make sure your authenticator app time is correct.");
        }

        // Code was correct — enable 2FA
        user.setTwoFactorEnabled(true);
        user.setTwoFactorVerified(true);
        userRepo.save(user);
    }

    // ─────────────────────────────────────────────────────────
    //  DISABLE 2FA
    //  User must provide current 6-digit code to disable
    // ─────────────────────────────────────────────────────────
    @Transactional
    public void disableTwoFactor(int code) {
        User user = getLoggedInUser();

        if (!user.isTwoFactorEnabled()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "2FA is not enabled for this account");
        }

        boolean valid = gAuth.authorize(user.getTwoFactorSecret(), code);

        if (!valid) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Invalid 2FA code. Cannot disable 2FA.");
        }

        user.setTwoFactorEnabled(false);
        user.setTwoFactorVerified(false);
        user.setTwoFactorSecret(null);
        userRepo.save(user);
    }

    // ─────────────────────────────────────────────────────────
    //  LOGIN STEP 2 — Verify code during login
    //  Called with tempToken from login step 1
    // ─────────────────────────────────────────────────────────
    public String getUsernameFromTempToken(String tempToken) {
        TempSession session = tempSessions.get(tempToken);

        if (session == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Session expired or invalid. Please login again.");
        }

        // Check if session is older than 5 minutes
        if (System.currentTimeMillis() - session.createdAt > 5 * 60 * 1000) {
            tempSessions.remove(tempToken);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "2FA session expired. Please login again.");
        }

        return session.username;
    }

    public boolean verifyCode(String username, int code) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "2FA is not enabled for this user");
        }

        return gAuth.authorize(user.getTwoFactorSecret(), code);
    }

    // ─────────────────────────────────────────────────────────
    //  TEMP TOKEN — Created after password check, before 2FA check
    // ─────────────────────────────────────────────────────────
    public String createTempToken(String username) {
        // Generate a random temp token
        String tempToken = java.util.UUID.randomUUID().toString();
        tempSessions.put(tempToken, new TempSession(username));

        // Clean up expired sessions to prevent memory leak
        cleanupExpiredSessions();

        return tempToken;
    }

    public void removeTempToken(String tempToken) {
        tempSessions.remove(tempToken);
    }

    // ─────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────
    private String generateQrCodeBase64(String qrUrl) {
        try {
            QRCodeWriter qrWriter = new QRCodeWriter();
            BitMatrix bitMatrix   = qrWriter.encode(qrUrl, BarcodeFormat.QR_CODE, 200, 200);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] pngBytes = outputStream.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngBytes);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to generate QR code");
        }
    }

    private User getLoggedInUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private void cleanupExpiredSessions() {
        long cutoff = System.currentTimeMillis() - 5 * 60 * 1000;
        tempSessions.entrySet().removeIf(e -> e.getValue().createdAt < cutoff);
    }

    // Inner class for temp session storage
    private static class TempSession {
        final String username;
        final long   createdAt;

        TempSession(String username) {
            this.username  = username;
            this.createdAt = System.currentTimeMillis();
        }
    }
}