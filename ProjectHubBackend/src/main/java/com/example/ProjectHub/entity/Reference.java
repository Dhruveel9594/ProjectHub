package com.example.ProjectHub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_references")
public class Reference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private Integer rating;
    private String type;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "given_by_id")
    private User givenBy;

    private LocalDateTime createdAt;

    public Reference() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public User getGivenBy() { return givenBy; }
    public void setGivenBy(User givenBy) { this.givenBy = givenBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
