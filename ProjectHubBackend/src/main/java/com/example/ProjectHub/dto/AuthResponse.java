package com.example.ProjectHub.dto;

// ── FIX: Added id field ──
// Before: id was missing so frontend couldn't call /api/user/{id}
// Now: id is returned on login so profile page works correctly
public class AuthResponse {

    private Long   id;
    private String accessToken;
    private String refreshToken;
    private String username;
    private String email;
    private String role;

    public AuthResponse(Long id, String accessToken, String refreshToken,
                        String username, String email, String role) {
        this.id           = id;
        this.accessToken  = accessToken;
        this.refreshToken = refreshToken;
        this.username     = username;
        this.email        = email;
        this.role         = role;
    }

    public Long   getId()           { return id;           }
    public String getAccessToken()  { return accessToken;  }
    public String getRefreshToken() { return refreshToken; }
    public String getUsername()     { return username;     }
    public String getEmail()        { return email;        }
    public String getRole()         { return role;         }
}