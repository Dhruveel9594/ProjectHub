package com.example.ProjectHub.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Year;

@Getter
@Setter
public class UpdateUserRequest {

    @NotNull(message = "Name is required")
    private String name;

    @NotNull(message = "bio is required")
    private String bio;

    @NotNull(message = "branch is required")
    private String branch;

    @NotNull(message = "year is required")
    private Year year;

    @NotNull(message = "collegeName is required")
    private String collegeName;

}

