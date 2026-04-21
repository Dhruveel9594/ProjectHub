package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.ProjectRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.Project;
import com.example.ProjectHub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private UserRepo userRepo;

    // ─────────────────────────────────────────────────────────
    //  CREATE
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Project createProject(Project project) {
        // ── FIX: Get username from JWT instead of @RequestParam ──
        // Before: username was passed as a query param — anyone could fake it
        // Now: username is extracted from the authenticated security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        project.setStudent(user);
        project.setCreatedAt(LocalDateTime.now());
        project.setVerified(false);
        project.setBookmarkCount(0);
        project.setRating(0.0);
        return projectRepo.save(project);
    }

    // ─────────────────────────────────────────────────────────
    //  GET ALL (with optional filters)
    // ─────────────────────────────────────────────────────────
    public List<Project> getAllProjects(String department, String year, String tag,
                                        String techStack, String projectType, String sortBy) {
        List<Project> projects = projectRepo.findAll();

        if (department != null)
            projects = projects.stream()
                    .filter(p -> department.equalsIgnoreCase(p.getDepartment())).toList();

        if (year != null)
            projects = projects.stream()
                    .filter(p -> year.equalsIgnoreCase(p.getYear())).toList();

        if (tag != null)
            projects = projects.stream()
                    .filter(p -> p.getTag() != null && p.getTag().toLowerCase().contains(tag.toLowerCase())).toList();

        if (techStack != null)
            projects = projects.stream()
                    .filter(p -> p.getTechStack() != null && p.getTechStack().toLowerCase().contains(techStack.toLowerCase())).toList();

        if (projectType != null)
            projects = projects.stream()
                    .filter(p -> projectType.equalsIgnoreCase(p.getProjectType())).toList();

        if ("top-rated".equalsIgnoreCase(sortBy))
            projects = projects.stream()
                    .sorted((a, b) -> Double.compare(b.getRating(), a.getRating())).toList();
        else if ("most-saved".equalsIgnoreCase(sortBy))
            projects = projects.stream()
                    .sorted((a, b) -> Integer.compare(b.getBookmarkCount(), a.getBookmarkCount())).toList();
        else
            projects = projects.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).toList();

        return projects;
    }

    // ─────────────────────────────────────────────────────────
    //  GET BY USER
    // ─────────────────────────────────────────────────────────
    public List<Project> getProjectsByUser(String username) {
        // ── FIX: Removed dead null check after orElseThrow ──
        // Before: had if(user == null) after orElseThrow — that can never execute
        userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return projectRepo.findByStudentUsername(username);
    }

    // ─────────────────────────────────────────────────────────
    //  GET BY ID
    // ─────────────────────────────────────────────────────────
    public Project getProjectById(Long id) {
        return projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    // ─────────────────────────────────────────────────────────
    //  UPDATE
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Project updateProject(Long id, Project updatedProject) {
        Project existing = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        // ── FIX: Ownership check ──
        // Before: any logged-in user could update any project
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existing.getStudent().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not allowed to update this project");
        }

        existing.setTitle(updatedProject.getTitle());
        existing.setDescription(updatedProject.getDescription());
        existing.setTechStack(updatedProject.getTechStack());
        existing.setGithubLink(updatedProject.getGithubLink());
        existing.setDemoLink(updatedProject.getDemoLink());
        existing.setFileUrl(updatedProject.getFileUrl());
        existing.setDepartment(updatedProject.getDepartment());
        existing.setYear(updatedProject.getYear());
        existing.setTag(updatedProject.getTag());
        existing.setProjectType(updatedProject.getProjectType());
        return projectRepo.save(existing);
    }

    // ─────────────────────────────────────────────────────────
    //  DELETE
    // ─────────────────────────────────────────────────────────
    @Transactional
    public void deleteProject(Long id) {
        Project existing = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        // ── FIX: Ownership check ──
        // Before: any logged-in user could delete any project
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existing.getStudent().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not allowed to delete this project");
        }

        projectRepo.deleteById(id);
    }

    // ─────────────────────────────────────────────────────────
    //  UPDATE THUMBNAIL
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Project updateThumbnail(Long id, String thumbnailUrl) {
        Project existing = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existing.getStudent().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not allowed to update this project");
        }

        existing.setThumbnailUrl(thumbnailUrl);
        return projectRepo.save(existing);
    }

    // ─────────────────────────────────────────────────────────
    //  TRENDING / SEARCH / VERIFY
    // ─────────────────────────────────────────────────────────
    public List<Project> getTrendingProjects() {
        return projectRepo.findTop10ByOrderByBookmarkCountDesc();
    }

    public List<Project> searchProjects(String q) {
        return projectRepo
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrTechStackContainingIgnoreCase(
                        q, q, q);
    }

    @Transactional
    public Project verifyProject(Long id) {
        Project existing = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        existing.setVerified(true);
        return projectRepo.save(existing);
    }
}