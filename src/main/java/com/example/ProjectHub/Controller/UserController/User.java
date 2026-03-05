package com.example.ProjectHub.Controller.UserController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class User {

    @GetMapping("/home")
    public String Home(){
        return "Home Page";
    }

}
