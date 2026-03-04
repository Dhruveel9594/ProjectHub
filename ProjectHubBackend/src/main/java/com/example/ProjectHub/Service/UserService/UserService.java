package com.example.ProjectHub.Service.UserService;

import com.example.ProjectHub.Model.User;
import com.example.ProjectHub.Repository.UserRepo.UserRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    public List<User> getUsers() {
        return userRepo.findAll();
    }

    public User getUserById(int id){
        return userRepo.findById(id).orElse(null);
    }

    public User userRegistration(User user) {
        return userRepo.save(user);
    }


}
