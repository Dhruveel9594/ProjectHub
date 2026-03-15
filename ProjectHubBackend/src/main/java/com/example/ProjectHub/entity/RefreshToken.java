package com.example.ProjectHub.entity;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.Instant;

// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE: RefreshToken entity
//
// Before: Refresh tokens were generated and returned but NEVER stored anywhere.
// This meant you could never revoke them — logout was impossible.
//
// Now: Every refresh token is saved in this table so you can:
//   1. Validate it on /refresh requests
//   2. Delete it on /logout (revoking that specific session)
//   3. Delete ALL of them on /logout-all (revoking every session)
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false, unique = true, length = 512)
    private String token;


    @Setter
    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private Instant expiresAt;

    public RefreshToken() {}

    public RefreshToken(String token, String username, Instant expiresAt) {
        this.token = token;
        this.username = username;
        this.expiresAt = expiresAt;
    }

    public Long getId() { return id; }

    public String getToken() { return token; }

    public String getUsername() { return username; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}