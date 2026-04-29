package com.example.ProjectHub.dto;

import lombok.Getter;

// ── 2FA Login Response ───────────────────────────────────────
// Returned after first step of login (password check)
// If 2FA enabled → requiresTwoFactor=true, no tokens yet
// If 2FA disabled → requiresTwoFactor=false, tokens included
@Getter
public class TwoFactorLoginResponse {

    private boolean requiresTwoFactor;

    // These are null if requiresTwoFactor = true
    // Sent only after both steps are complete
    private String accessToken;
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    private String role;

    // Temporary token used to identify the user in step 2
    // Valid for 5 minutes — not a JWT, just a session identifier
    private String tempToken;

    // Constructor for when 2FA is required
    public TwoFactorLoginResponse(String tempToken) {
        this.requiresTwoFactor = true;
        this.tempToken = tempToken;
    }

    // Constructor for when 2FA is not required (normal login)
    public TwoFactorLoginResponse(String accessToken, String refreshToken,
                                  Long id, String username,
                                  String email, String role) {
        this.requiresTwoFactor = false;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

}
