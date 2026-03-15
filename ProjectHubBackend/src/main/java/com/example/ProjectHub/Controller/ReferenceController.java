package com.example.ProjectHub.controller;

import com.example.ProjectHub.service.ReferenceService;
import com.example.ProjectHub.entity.Reference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/references")
public class ReferenceController {

    @Autowired
    private ReferenceService referenceService;

    // Add reference to a project
    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> addReference(
            @PathVariable Long projectId,
            @RequestParam String username,
            @RequestBody Reference reference) {
        try {
            Reference saved = referenceService.addReference(projectId, username, reference);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get all references for a project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Long projectId) {
        try {
            List<Reference> refs = referenceService.getByProject(projectId);
            return ResponseEntity.ok(refs);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get all references given by a user
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getByUser(@PathVariable String username) {
        try {
            List<Reference> refs = referenceService.getByUser(username);
            return ResponseEntity.ok(refs);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Delete a reference
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReference(@PathVariable Long id) {
        try {
            referenceService.deleteReference(id);
            return ResponseEntity.ok("Reference deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
