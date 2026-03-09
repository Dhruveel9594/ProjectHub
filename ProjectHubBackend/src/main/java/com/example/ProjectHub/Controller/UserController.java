package com.example.ProjectHub.Controller;

import com.example.ProjectHub.Service.UserService;
import com.example.ProjectHub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> Home(){
        return userService.getAllUsers();
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register( @RequestBody User user){
//        //1:get user details from frontend
//        //2:validation - not empty
//        //3:check if user for already exists: username, email
//        //4:check for profileImage
//        //5:upload them to cloudinary
//        //6:create user object - create entry in db
//        //7:remove password and refresh token from response
//        //8:check for user creation
//        //9:return res
//
        User savedUser = userService.registration(user);

        return ResponseEntity.status(201).body(savedUser);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody User user){
        Map<String , String> tokens = userService.verify(user);
        return ResponseEntity.ok(tokens);
    }


    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable int id){
        return userService.deleteUser(id);
    }


}
