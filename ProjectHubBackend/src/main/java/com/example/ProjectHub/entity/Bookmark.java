package com.example.ProjectHub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(
        name = "bookmarks",
        // Prevent same user from bookmarking same project twice
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "project_id"})
)
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private LocalDateTime createdAt;

    public Bookmark(User user, Project project) {
        this.user      = user;
        this.project   = project;
        this.createdAt = LocalDateTime.now();
    }
}