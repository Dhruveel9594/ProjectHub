package com.example.ProjectHub.Controller.UserController;

import com.example.ProjectHub.Model.User;
import com.example.ProjectHub.Service.UserService.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.naming.Binding;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/home")
    public String Home(){
        return "Home Page";
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(){
        List<User> user = userService.getUsers();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> userRegistration(@Valid @RequestBody User user){
        //1:get user details from frontend
        //2:validation - not empty
        //3:check if user for already exists: username, email
        //4:check for profileImage
        //5:upload them to cloudinary
        //6:create user object - create entry in db
        //7:remove password and refresh token from response
        //8:check for user creation
        //9:return res
        return new ResponseEntity<>(userService.userRegistration(user),HttpStatus.CREATED);

    }



}
