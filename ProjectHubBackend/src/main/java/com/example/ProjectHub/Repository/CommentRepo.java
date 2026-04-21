package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {

    // Get top-level comments only (no replies) for a project, newest first
    List<Comment> findByProjectIdAndParentIsNullOrderByCreatedAtDesc(Long projectId);

    // Count all comments for a project
    int countByProjectId(Long projectId);
}