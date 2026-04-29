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

// ── 2FA Verify Request ───────────────────────────────────────
// Sent by frontend to verify 6-digit code
// Used in both: setup verification + login verification
class TwoFactorVerifyRequest {
    private int code; // 6-digit TOTP code from authenticator app

    public int  getCode()           { return code; }
    public void setCode(int code)   { this.code = code; }
}

// ── 2FA Login Response ───────────────────────────────────────
// Returned after first step of login (password check)
// If 2FA enabled → requiresTwoFactor=true, no tokens yet
// If 2FA disabled → requiresTwoFactor=false, tokens included
class TwoFactorLoginResponse {

    private boolean requiresTwoFactor;

    // These are null if requiresTwoFactor = true
    // Sent only after both steps are complete
    private String accessToken;
    private String refreshToken;
    private Long   id;
    private String username;
    private String email;
    private String role;

    // Temporary token used to identify the user in step 2
    // Valid for 5 minutes — not a JWT, just a session identifier
    private String tempToken;

    // Constructor for when 2FA is required
    public TwoFactorLoginResponse(String tempToken) {
        this.requiresTwoFactor = true;
        this.tempToken         = tempToken;
    }

    // Constructor for when 2FA is not required (normal login)
    public TwoFactorLoginResponse(String accessToken, String refreshToken,
                                  Long id, String username,
                                  String email, String role) {
        this.requiresTwoFactor = false;
        this.accessToken       = accessToken;
        this.refreshToken      = refreshToken;
        this.id                = id;
        this.username          = username;
        this.email             = email;
        this.role              = role;
    }

    public boolean isRequiresTwoFactor() { return requiresTwoFactor; }
    public String  getAccessToken()      { return accessToken;       }
    public String  getRefreshToken()     { return refreshToken;      }
    public Long    getId()               { return id;                }
    public String  getUsername()         { return username;          }
    public String  getEmail()            { return email;             }
    public String  getRole()             { return role;              }
    public String  getTempToken()        { return tempToken;         }
}