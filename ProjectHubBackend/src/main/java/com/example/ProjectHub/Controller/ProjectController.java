package com.example.ProjectHub.controller;

import com.example.ProjectHub.service.ProjectService;
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

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project, @RequestParam String username) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(project, username));
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
        List<Project> projects = projectService.getAllProjects(department, year, tag, techStack, projectType, sortBy);
        if (projects.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No projects found");
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
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project project) {
        try {
            return ResponseEntity.ok(projectService.updateProject(id, project));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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
    public ResponseEntity<?> updateThumbnail(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String thumbnailUrl = body.get("thumbnailUrl");
            return ResponseEntity.ok(projectService.updateThumbnail(id, thumbnailUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrending() {
        List<Project> projects = projectService.getTrendingProjects();
        if (projects.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No trending projects found");
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProjects(@RequestParam String q) {
        List<Project> projects = projectService.searchProjects(q);
        if (projects.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No projects found for: " + q);
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyProject(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.verifyProject(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
