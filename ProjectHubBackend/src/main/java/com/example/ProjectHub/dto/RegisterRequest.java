package com.example.ProjectHub.dto;

import com.example.ProjectHub.entity.AcademicYear;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be 3–20 characters")
    private String username;

    // ── FIX: Added missing fields ──
    // Before: name, bio, branch, year, collegeName were missing
    // so registration saved users with null profile fields.
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "College name is required")
    private String collegeName;

    @NotBlank(message = "Branch is required")
    private String branch;

    // Bio is optional
    private String bio;

    @NotNull(message = "Year is required")
    private AcademicYear year;
}