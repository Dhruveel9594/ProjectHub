package com.example.ProjectHub.dto;

import com.example.ProjectHub.entity.AcademicYear;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.Year;

@Getter
public class UpdateResponse {

    private Long id;
    private String username;
    private String email;
    private String role;

    private String name;
    private String bio;
    private String branch;
    private AcademicYear year;
    private String collegeName;

    public UpdateResponse(Long id, String username, String email, String role,
                          String name, String bio, String branch,
                          AcademicYear year, String collegeName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.name = name;
        this.bio = bio;
        this.branch = branch;
        this.year = year;
        this.collegeName = collegeName;
    }
}