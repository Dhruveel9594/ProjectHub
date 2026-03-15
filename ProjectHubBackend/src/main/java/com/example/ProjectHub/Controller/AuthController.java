package com.example.ProjectHub.controller;

import com.example.ProjectHub.service.UserService;
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
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = userService.registration(request);

        //  Returns RegisterResponse DTO (id, username, email only).
        // Before: returned the full User entity including hashed password.
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = userService.verify(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, @RequestBody Map<String, String> body) {

        String accessToken = extractToken(request);
        String refreshToken = body.get("refreshToken");

        userService.logout(accessToken, refreshToken);
        return ResponseEntity.ok("Logged out successfully");
    }





    // Client sends: { "refreshToken": "<refreshToken>" }
    // Client gets back: new accessToken + new refreshToken
    // Call this when your frontend gets a 401 on any request.
    // If this also returns 401, the user must log in again.
    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
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