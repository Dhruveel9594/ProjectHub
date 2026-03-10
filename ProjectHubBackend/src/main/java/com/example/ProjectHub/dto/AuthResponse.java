package com.example.ProjectHub.dto;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String username;
    private String email;

    public AuthResponse(String accessToken, String refreshToken,
                        String username, String email) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
        this.email = email;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
}