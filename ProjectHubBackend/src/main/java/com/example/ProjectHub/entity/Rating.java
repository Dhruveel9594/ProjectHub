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
        name = "ratings",
        // One rating per user per project
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "project_id"})
)
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int score; // 1 to 5

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private LocalDateTime createdAt;

    public Rating(User user, Project project, int score) {
        this.user      = user;
        this.project   = project;
        this.score     = score;
        this.createdAt = LocalDateTime.now();
    }
}