package com.example.ProjectHub.service;

import com.example.ProjectHub.repository.ProjectRepo;
import com.example.ProjectHub.repository.UserRepo;
import com.example.ProjectHub.entity.Project;
import com.example.ProjectHub.entity.User;
import com.example.ProjectHub.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private UserRepo userRepo;

    public Project createProject(Project project, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        project.setStudent(user);
        project.setCreatedAt(LocalDateTime.now());
        return projectRepo.save(project);
    }

    public List<Project> getAllProjects(String department, String year, String tag, String techStack, String projectType, String sortBy) {
        List<Project> projects = projectRepo.findAll();
        if (department != null) projects = projects.stream().filter(p -> department.equalsIgnoreCase(p.getDepartment())).toList();
        if (year != null) projects = projects.stream().filter(p -> year.equalsIgnoreCase(p.getYear())).toList();
        if (tag != null) projects = projects.stream().filter(p -> tag.equalsIgnoreCase(p.getTag())).toList();
        if (techStack != null) projects = projects.stream().filter(p -> p.getTechStack() != null && p.getTechStack().toLowerCase().contains(techStack.toLowerCase())).toList();
        if (projectType != null) projects = projects.stream().filter(p -> projectType.equalsIgnoreCase(p.getProjectType())).toList();
        if ("top-rated".equalsIgnoreCase(sortBy)) projects = projects.stream().sorted((a, b) -> Double.compare(b.getRating(), a.getRating())).toList();
        else if ("most-saved".equalsIgnoreCase(sortBy)) projects = projects.stream().sorted((a, b) -> Integer.compare(b.getBookmarkCount(), a.getBookmarkCount())).toList();
        else projects = projects.stream().sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).toList();
        return projects;
    }

    public List<Project> getProjectsByUser(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        if (user == null) throw new RuntimeException("User not found: " + username);
        return projectRepo.findByStudentUsername(username);
    }

    public Project getProjectById(Long id) {
        return projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public void deleteProject(Long id) {
        if (!projectRepo.existsById(id)) throw new RuntimeException("Project not found with id: " + id);
        projectRepo.deleteById(id);
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existing = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
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

    public Project updateThumbnail(Long id, String thumbnailUrl) {
        Project existing = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        existing.setThumbnailUrl(thumbnailUrl);
        return projectRepo.save(existing);
    }

    public List<Project> getTrendingProjects() {
        return projectRepo.findTop10ByOrderByBookmarkCountDesc();
    }

    public List<Project> searchProjects(String q) {
        return projectRepo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrTechStackContainingIgnoreCase(q, q, q);
    }

    public Project verifyProject(Long id) {
        Project existing = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        existing.setVerified(true);
        return projectRepo.save(existing);
    }
}
