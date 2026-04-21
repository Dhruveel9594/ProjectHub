package com.example.ProjectHub.Controller;

import com.example.ProjectHub.Service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    // POST /api/bookmarks/project/{projectId}
    // Toggle bookmark — adds if not bookmarked, removes if already bookmarked
    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> toggle(@PathVariable Long projectId) {
        boolean added = bookmarkService.toggle(projectId);
        return ResponseEntity.ok(Map.of(
                "bookmarked", added,
                "message", added ? "Project bookmarked" : "Bookmark removed"
        ));
    }

    // GET /api/bookmarks/project/{projectId}/status
    // Check if current user bookmarked this project
    @GetMapping("/project/{projectId}/status")
    public ResponseEntity<?> status(@PathVariable Long projectId) {
        boolean isBookmarked = bookmarkService.isBookmarked(projectId);
        return ResponseEntity.ok(Map.of("bookmarked", isBookmarked));
    }

    // GET /api/bookmarks/my
    // Get all projects bookmarked by the current user
    @GetMapping("/my")
    public ResponseEntity<?> myBookmarks() {
        return ResponseEntity.ok(bookmarkService.getMyBookmarks());
    }
}