package com.example.ProjectHub.dto;

// ── 2FA Setup Response ───────────────────────────────────────
// Sent to frontend when user initiates 2FA setup
// Contains QR code image (base64) and secret for manual entry
public class TwoFactorSetupResponse {

    private String secret;       // secret key for manual entry
    private String qrCodeImage;  // base64 PNG of QR code to scan

    public TwoFactorSetupResponse(String secret, String qrCodeImage) {
        this.secret      = secret;
        this.qrCodeImage = qrCodeImage;
    }

    public String getSecret()      { return secret;      }
    public String getQrCodeImage() { return qrCodeImage; }
}

