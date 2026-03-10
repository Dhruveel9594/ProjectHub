package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.RefreshTokenRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.dto.AuthResponse;
import com.example.ProjectHub.dto.LoginRequest;
import com.example.ProjectHub.dto.RegisterRequest;
import com.example.ProjectHub.dto.RegisterResponse;
import com.example.ProjectHub.entity.RefreshToken;
import com.example.ProjectHub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RefreshTokenRepo refreshTokenRepo;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private LoginAttemptService loginAttemptService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    @Transactional
    public RegisterResponse registration(RegisterRequest request) {


        if (userRepo.findByUsername(request.getUsername()) != null) {
            throw new RuntimeException("Username already taken");

        }

        // Duplicate email check — new, wasn't there before at all
        if (userRepo.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));

        User saved = userRepo.save(user);
        return new RegisterResponse(saved.getId(), saved.getUsername(), saved.getEmail());
    }



    @Transactional
    public AuthResponse verify(LoginRequest request) {

        // check — new, wasn't there before.
        // Blocks the username for 15 mins after 5 failed attempts.
        if (loginAttemptService.isBlocked(request.getUsername())) {
            throw new RuntimeException("Account temporarily locked. Try again in 15 minutes.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {

            loginAttemptService.recordFailure(request.getUsername());
            throw new RuntimeException("Invalid username or password");
        }

        // Login succeeded — clear any recorded failures
        loginAttemptService.clearFailures(request.getUsername());

        // Generate both tokens
        String accessToken = jwtService.generateAccessToken(request.getUsername());
        String refreshToken = jwtService.generateRefreshToken(request.getUsername());

        // Save refresh token to DB.
        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpiry());
        refreshTokenRepo.save(new RefreshToken(refreshToken, request.getUsername(), expiresAt));

        User user = userRepo.findByUsername(request.getUsername());
        return new AuthResponse(accessToken, refreshToken, user.getUsername(), user.getEmail());
    }


    @Transactional
    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null) {
            tokenBlacklistService.blacklist(
                    accessToken,
                    jwtService.extractExpiration(accessToken)
            );
        }
        if (refreshToken != null) {
            refreshTokenRepo.deleteByToken(refreshToken);
        }
    }



    @Transactional
    public AuthResponse refresh(String refreshTokenStr) {
        Optional<RefreshToken> stored = refreshTokenRepo.findByToken(refreshTokenStr);

        if (stored.isEmpty()) {
            throw new RuntimeException("Invalid refresh token");
        }

        RefreshToken refreshToken = stored.get();

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepo.delete(refreshToken);
            throw new RuntimeException("Refresh token expired. Please log in again.");
        }

        String username = refreshToken.getUsername();

        // Delete old token (rotation — one-time use)
        refreshTokenRepo.delete(refreshToken);

        // Issue new tokens
        String newAccessToken = jwtService.generateAccessToken(username);
        String newRefreshToken = jwtService.generateRefreshToken(username);

        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpiry());
        refreshTokenRepo.save(new RefreshToken(newRefreshToken, username, expiresAt));

        User user = userRepo.findByUsername(username);
        return new AuthResponse(newAccessToken, newRefreshToken, user.getUsername(), user.getEmail());
    }


    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

}