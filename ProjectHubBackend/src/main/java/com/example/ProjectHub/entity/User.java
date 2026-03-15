package com.example.ProjectHub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
//@AllArgsConstructor
//@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    @JsonIgnore
    private String password;
    private String role;
    private String collegeName;

    public User() {}
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public String getCollegeName() { return collegeName; }
//    public String getName() { return name; }
//    public String getCompanyName() { return companyName; }
//    public String getProfilePicture() { return profilePicture; }
    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
//    public void setName(String name) { this.name = name; }
//    public void setCompanyName(String companyName) { this.companyName = companyName; }
//    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}
