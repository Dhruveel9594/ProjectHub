package com.example.ProjectHub.Service;

import com.example.ProjectHub.dto.*;
import com.example.ProjectHub.entity.Project;
import com.example.ProjectHub.Repository.RefreshTokenRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.RefreshToken;
import com.example.ProjectHub.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProjectService projectService;

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

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;



    @Transactional
    public RegisterResponse registration(RegisterRequest request) {


        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");

        }

        // Duplicate email check — new, wasn't there before at all
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(request.getRole());

        User saved = userRepo.save(user);
        return new RegisterResponse(saved.getId(), saved.getUsername(), saved.getEmail(),saved.getRole());
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

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));
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

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return new AuthResponse(newAccessToken, newRefreshToken, user.getUsername(), user.getEmail());
    }


    public UpdateResponse getUserById(long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));

        return new UpdateResponse(user.getName(), user.getBio(), user.getCollegeName(), user.getYear(), user.getBranch());
    }


    public UpdateResponse updateUser(long id, @Valid UpdateUserRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!user.getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to update this profile");
        }

        user.setName(request.getName());
        user.setBio(request.getBio());
        user.setCollegeName(request.getCollegeName());
        user.setYear(request.getYear());
        user.setBranch(request.getBranch());

        User saved = userRepo.save(user);
        return new UpdateResponse(saved.getName(), saved.getBio(), saved.getCollegeName(), saved.getYear(), saved.getBranch());
    }

    public List<Project> userProjects(long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!user.getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to see");
        }

        List<Project> allProjects = projectService.getProjectsByUser(user.getUsername());
        if (allProjects.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No Projects Found");
        }

        return allProjects;

    }
}