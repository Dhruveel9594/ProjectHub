package com.example.ProjectHub.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String techStack;
    private String githubLink;
    private String demoLink;
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private LocalDateTime createdAt;
}