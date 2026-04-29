package com.example.ProjectHub.dto;

// ── 2FA Verify Request ───────────────────────────────────────
// Sent by frontend to verify 6-digit code
// Used in both: setup verification + login verification
public class TwoFactorVerifyRequest {
    private int code; // 6-digit TOTP code from authenticator app

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}
