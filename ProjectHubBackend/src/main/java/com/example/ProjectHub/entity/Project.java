package com.example.ProjectHub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "projects")
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
    private String thumbnailUrl;
    private String department;
    private String year;
    private String tag;
    private String projectType;
    private boolean verified = false;
    private int bookmarkCount = 0;
    private double rating = 0.0;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private LocalDateTime createdAt;

    public Project() {}

}
