package com.example.ProjectHub.Controller;

import com.example.ProjectHub.Service.UserService;
import com.example.ProjectHub.dto.AuthResponse;
import com.example.ProjectHub.dto.LoginRequest;
import com.example.ProjectHub.dto.RegisterRequest;
import com.example.ProjectHub.dto.RegisterResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = userService.registration(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── Login Step 1 ──
    // Checks password. If 2FA enabled → returns tempToken
    // If 2FA not enabled → returns full JWT tokens
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        // verify() now returns Object — either AuthResponse or TwoFactorLoginResponse
        Object response = userService.verify(request);
        return ResponseEntity.ok(response);
    }

    // ── Login Step 2 (2FA) ──
    // Called only when login returns requiresTwoFactor: true
    // Body: { "tempToken": "uuid", "code": 123456 }
    @PostMapping("/auth/verify-2fa")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody Map<String, Object> body) {
        try {
            String  tempToken = (String)  body.get("tempToken");
            Integer code      = (Integer) body.get("code");

            if (tempToken == null || code == null) {
                return ResponseEntity.badRequest()
                        .body("tempToken and code are required");
            }

            AuthResponse response = userService.verifyTwoFactorLogin(tempToken, code);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<String> logout(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {
        String accessToken  = extractToken(request);
        String refreshToken = body.get("refreshToken");
        userService.logout(accessToken, refreshToken);
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        AuthResponse response = userService.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}