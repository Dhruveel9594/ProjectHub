package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// ── FIX: Changed JpaRepository<User, Integer> → JpaRepository<User, Long> ──
// Before: User ID is Long but repo used Integer — caused type mismatch errors
@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}