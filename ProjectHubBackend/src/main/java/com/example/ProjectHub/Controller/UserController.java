package com.example.ProjectHub.Controller;

import com.example.ProjectHub.dto.UpdateResponse;
import com.example.ProjectHub.dto.UpdateUserRequest;
import com.example.ProjectHub.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> userProfile(@PathVariable Long id) {
        try {
            UpdateResponse response = userService.getUserById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateUserRequest request,
            @PathVariable Long id) {
        try {
            UpdateResponse response = userService.updateUser(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ── FIX: Changed long → Long for consistency ──
    @GetMapping("/{id}/projects")
    public ResponseEntity<?> userProjects(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.userProjects(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}