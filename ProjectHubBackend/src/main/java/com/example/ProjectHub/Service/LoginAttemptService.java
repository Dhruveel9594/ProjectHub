package com.example.ProjectHub.Service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_DURATION_SECONDS = 15 * 60; // 15 minutes

    // Key = username, Value = attempt info
    private final Map<String, AttemptInfo> attempts = new ConcurrentHashMap<>();

    // Called from UserService after a failed authentication
    public void recordFailure(String username) {
        AttemptInfo info = attempts.getOrDefault(username, new AttemptInfo());
        info.count++;
        info.lastAttempt = Instant.now();
        attempts.put(username, info);
    }

    // Called from UserService before attempting authentication
    public boolean isBlocked(String username) {
        AttemptInfo info = attempts.get(username);
        if (info == null) return false;

        // If lock duration has passed, reset and allow
        if (Instant.now().isAfter(info.lastAttempt.plusSeconds(LOCK_DURATION_SECONDS))) {
            attempts.remove(username);
            return false;
        }

        return info.count >= MAX_ATTEMPTS;
    }

    // Called from UserService after a successful login
    public void clearFailures(String username) {
        attempts.remove(username);
    }

    private static class AttemptInfo {
        int count = 0;
        Instant lastAttempt = Instant.now();
    }
}