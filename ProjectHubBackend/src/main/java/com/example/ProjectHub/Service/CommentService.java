package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.CommentRepo;
import com.example.ProjectHub.Repository.ProjectRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.Comment;
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
public class CommentService {

    @Autowired private CommentRepo  commentRepo;
    @Autowired private ProjectRepo  projectRepo;
    @Autowired private UserRepo     userRepo;

    // ── Add top-level comment ──
    @Transactional
    public Comment addComment(Long projectId, String content) {
        User    user    = getLoggedInUser();
        Project project = getProject(projectId);

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUser(user);
        comment.setProject(project);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepo.save(comment);
    }

    // ── Add reply to an existing comment ──
    @Transactional
    public Comment addReply(Long projectId, Long parentCommentId, String content) {
        User    user    = getLoggedInUser();
        Project project = getProject(projectId);

        Comment parent = commentRepo.findById(parentCommentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Parent comment not found"));

        // Replies can only be one level deep
        if (parent.getParent() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot reply to a reply. Reply to the top-level comment instead.");
        }

        Comment reply = new Comment();
        reply.setContent(content);
        reply.setUser(user);
        reply.setProject(project);
        reply.setParent(parent);
        reply.setCreatedAt(LocalDateTime.now());

        return commentRepo.save(reply);
    }

    // ── Get all top-level comments for a project (replies are nested inside) ──
    public List<Comment> getComments(Long projectId) {
        getProject(projectId); // validate project exists
        return commentRepo.findByProjectIdAndParentIsNullOrderByCreatedAtDesc(projectId);
    }

    // ── Delete comment (only own comments) ──
    @Transactional
    public void deleteComment(Long commentId) {
        User user = getLoggedInUser();

        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can only delete your own comments");
        }

        commentRepo.delete(comment);
    }

    // ── Helpers ──
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