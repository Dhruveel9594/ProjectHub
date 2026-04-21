package com.example.ProjectHub.Controller;

import com.example.ProjectHub.Service.CommentService;
import com.example.ProjectHub.entity.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // POST /api/comments/project/{projectId}
    // Add a new comment to a project
    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> addComment(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> body) {
        try {
            String content = body.get("content");
            if (content == null || content.isBlank()) {
                return ResponseEntity.badRequest().body("Content is required");
            }
            Comment comment = commentService.addComment(projectId, content);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/comments/project/{projectId}/reply/{parentCommentId}
    // Reply to an existing comment
    @PostMapping("/project/{projectId}/reply/{parentCommentId}")
    public ResponseEntity<?> addReply(
            @PathVariable Long projectId,
            @PathVariable Long parentCommentId,
            @RequestBody Map<String, String> body) {
        try {
            String content = body.get("content");
            if (content == null || content.isBlank()) {
                return ResponseEntity.badRequest().body("Content is required");
            }
            Comment reply = commentService.addReply(projectId, parentCommentId, content);
            return ResponseEntity.status(HttpStatus.CREATED).body(reply);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/comments/project/{projectId}
    // Get all comments for a project (with replies nested inside)
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getComments(@PathVariable Long projectId) {
        List<Comment> comments = commentService.getComments(projectId);
        return ResponseEntity.ok(comments);
    }

    // DELETE /api/comments/{commentId}
    // Delete own comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok("Comment deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}