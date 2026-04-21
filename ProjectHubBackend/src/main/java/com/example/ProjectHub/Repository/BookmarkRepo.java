package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepo extends JpaRepository<Bookmark, Long> {

    // Check if user already bookmarked this project
    Optional<Bookmark> findByUserIdAndProjectId(Long userId, Long projectId);

    // Get all bookmarks by a user
    List<Bookmark> findByUserId(Long userId);

    // Count bookmarks for a project
    int countByProjectId(Long projectId);

    // Check existence
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);
}