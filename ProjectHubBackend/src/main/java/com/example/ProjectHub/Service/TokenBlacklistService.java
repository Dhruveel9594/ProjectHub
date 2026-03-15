package com.example.ProjectHub.service;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Service
public class TokenBlacklistService {

    // Key = token string, Value = when it actually expires
    // We store the expiry so we can clean up expired entries and not
    // grow this map forever.
    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    // Called on /logout — adds the access token to the blacklist
    public void blacklist(String token, Date expiry) {
        blacklist.put(token, expiry);
        cleanupExpired();
    }

    // Called in JWTFilter before validating any token
    public boolean isBlacklisted(String token) {
        return blacklist.containsKey(token);
    }

    private void cleanupExpired() {
        Date now = new Date();
        blacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}