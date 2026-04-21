package com.example.ProjectHub.Controller;

import com.example.ProjectHub.Service.ProjectService;
import com.example.ProjectHub.entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // ── FIX: Removed @RequestParam String username ──
    // Before: username was passed as query param ?username=john — anyone could fake it
    // Now: ProjectService reads username from SecurityContextHolder (JWT)
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(projectService.createProject(project));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllProjects(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String techStack,
            @RequestParam(required = false) String projectType,
            @RequestParam(required = false) String sortBy) {

        List<Project> projects = projectService.getAllProjects(
                department, year, tag, techStack, projectType, sortBy);

        // ── FIX: Return empty list instead of 404 ──
        // Before: returned 404 when no projects found — frontend showed error
        // Now: returns empty array [] so frontend shows "No projects" state
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.getProjectById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {
        try {
            return ResponseEntity.ok(projectService.updateProject(id, project));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok("Project deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/thumbnail")
    public ResponseEntity<?> updateThumbnail(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String thumbnailUrl = body.get("thumbnailUrl");
            return ResponseEntity.ok(projectService.updateThumbnail(id, thumbnailUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrending() {
        return ResponseEntity.ok(projectService.getTrendingProjects());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProjects(@RequestParam String q) {
        return ResponseEntity.ok(projectService.searchProjects(q));
    }

    // ── NOTE: Only FACULTY/ADMIN should call this ──
    // Add @PreAuthorize("hasRole('Faculty')") here once role-based
    // security is configured in SecurityConfig
    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyProject(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.verifyProject(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}