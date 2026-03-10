package com.example.ProjectHub.dto;

import lombok.Getter;

@Getter
public class RegisterResponse {

    private Long id;
    private String username;
    private String email;

    public RegisterResponse(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

}