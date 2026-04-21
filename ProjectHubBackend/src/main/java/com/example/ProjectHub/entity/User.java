package com.example.ProjectHub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String name;

    private String email;

    @JsonIgnore
    private String password;

    private String role;

    private String collegeName;

    private String branch;

    private String bio;


    @Enumerated(EnumType.STRING)
    private AcademicYear year;

    private LocalDateTime createdAt;
}