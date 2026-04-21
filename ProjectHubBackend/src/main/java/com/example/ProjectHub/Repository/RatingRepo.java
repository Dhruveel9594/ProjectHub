package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndProjectId(Long userId, Long projectId);

    List<Rating> findByProjectId(Long projectId);

    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    // Calculate average rating for a project in one DB query
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.project.id = :projectId")
    Double findAverageRatingByProjectId(Long projectId);
}