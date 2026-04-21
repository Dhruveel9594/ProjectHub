package com.example.ProjectHub.dto;

import com.example.ProjectHub.entity.AcademicYear;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    // Bio is optional
    private String bio;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "Year is required")
    private AcademicYear year;

    @NotBlank(message = "College name is required")
    private String collegeName;
}