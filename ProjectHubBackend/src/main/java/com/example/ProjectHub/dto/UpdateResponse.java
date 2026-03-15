package com.example.ProjectHub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.Year;

@Getter
public class UpdateResponse {
    private String name;
    private String bio;
    private String branch;
    private Year year;

    private String collegeName;

    public UpdateResponse(String name, String bio, String branch, Year year, String collegeName) {
        this.name = name;
        this.bio = bio;
        this.branch = branch;
        this.year = year;
        this.collegeName = collegeName;
    }
}
