package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.BookmarkRepo;
import com.example.ProjectHub.Repository.ProjectRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.Bookmark;
import com.example.ProjectHub.entity.Project;
import com.example.ProjectHub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class BookmarkService {

    @Autowired private BookmarkRepo  bookmarkRepo;
    @Autowired private ProjectRepo   projectRepo;
    @Autowired private UserRepo      userRepo;

    // ── Toggle bookmark — add if not exists, remove if exists ──
    @Transactional
    public boolean toggle(Long projectId) {
        User user = getLoggedInUser();

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Project not found"));

        Optional<Bookmark> existing =
                bookmarkRepo.findByUserIdAndProjectId(user.getId(), projectId);

        if (existing.isPresent()) {
            // Already bookmarked — remove it
            bookmarkRepo.delete(existing.get());
            project.setBookmarkCount(Math.max(0, project.getBookmarkCount() - 1));
            projectRepo.save(project);
            return false; // false = removed
        } else {
            // Not bookmarked — add it
            bookmarkRepo.save(new Bookmark(user, project));
            project.setBookmarkCount(project.getBookmarkCount() + 1);
            projectRepo.save(project);
            return true; // true = added
        }
    }

    // ── Check if current user bookmarked a project ──
    public boolean isBookmarked(Long projectId) {
        User user = getLoggedInUser();
        return bookmarkRepo.existsByUserIdAndProjectId(user.getId(), projectId);
    }

    // ── Get all projects bookmarked by current user ──
    public List<Project> getMyBookmarks() {
        User user = getLoggedInUser();
        return bookmarkRepo.findByUserId(user.getId())
                .stream()
                .map(Bookmark::getProject)
                .toList();
    }

    // ── Helper ──
    private User getLoggedInUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found: " + username));
    }
}