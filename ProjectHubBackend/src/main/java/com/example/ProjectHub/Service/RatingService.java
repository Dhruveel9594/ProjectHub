package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.ProjectRepo;
import com.example.ProjectHub.Repository.RatingRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.Project;
import com.example.ProjectHub.entity.Rating;
import com.example.ProjectHub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class RatingService {

    @Autowired private RatingRepo  ratingRepo;
    @Autowired private ProjectRepo projectRepo;
    @Autowired private UserRepo    userRepo;

    // ── Rate or update existing rating ──
    @Transactional
    public double rateProject(Long projectId, int score) {
        if (score < 1 || score > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Score must be between 1 and 5");
        }

        User    user    = getLoggedInUser();
        Project project = getProject(projectId);

        // Check if user already rated this project
        Optional<Rating> existing =
                ratingRepo.findByUserIdAndProjectId(user.getId(), projectId);

        if (existing.isPresent()) {
            // Update existing rating
            existing.get().setScore(score);
            ratingRepo.save(existing.get());
        } else {
            // Create new rating
            ratingRepo.save(new Rating(user, project, score));
        }

        // Recalculate average and save to project
        double avg = recalculateAverage(projectId);
        project.setRating(avg);
        projectRepo.save(project);

        return avg;
    }

    // ── Get current user's rating for a project ──
    public Integer getMyRating(Long projectId) {
        User user = getLoggedInUser();
        return ratingRepo.findByUserIdAndProjectId(user.getId(), projectId)
                .map(Rating::getScore)
                .orElse(null); // null means not yet rated
    }

    // ── Get average rating for a project ──
    public double getAverageRating(Long projectId) {
        getProject(projectId);
        Double avg = ratingRepo.findAverageRatingByProjectId(projectId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    // ── Helpers ──
    private double recalculateAverage(Long projectId) {
        Double avg = ratingRepo.findAverageRatingByProjectId(projectId);
        if (avg == null) return 0.0;
        return Math.round(avg * 10.0) / 10.0;
    }

    private User getLoggedInUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private Project getProject(Long projectId) {
        return projectRepo.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Project not found"));
    }
}