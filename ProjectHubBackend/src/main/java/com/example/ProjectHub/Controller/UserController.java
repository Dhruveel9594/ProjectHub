package com.example.ProjectHub.controller;


import com.example.ProjectHub.dto.UpdateResponse;
import com.example.ProjectHub.dto.UpdateUserRequest;
import com.example.ProjectHub.entity.Project;
import com.example.ProjectHub.repository.ProjectRepo;
import com.example.ProjectHub.service.ProjectService;
import com.example.ProjectHub.service.UserService;
import com.example.ProjectHub.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body( e.getMessage());
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}/projects")
    public ResponseEntity<?> userProjects(@PathVariable long id){
        try {
            return ResponseEntity.ok(userService.userProjects(id));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}
