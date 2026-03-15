package com.example.ProjectHub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.Year;

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


//    private String companyName;
    //private String profilePicture;

    private String branch;
    private String bio;
    private Year year;
    private LocalDateTime createdAt;

}
