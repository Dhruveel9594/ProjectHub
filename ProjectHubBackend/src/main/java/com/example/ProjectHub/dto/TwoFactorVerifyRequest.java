package com.example.ProjectHub.dto;

// ── 2FA Verify Request ───────────────────────────────────────
// Sent by frontend to verify 6-digit code
// Used in both: setup verification + login verification
public class TwoFactorVerifyRequest {
    private String code; // 6-digit TOTP code from authenticator app

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
