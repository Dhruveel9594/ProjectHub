package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JWTService jwTservice;
    @Autowired
    AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public String deleteUser(int id) {
        userRepo.deleteById(id);
        return "User Deleted";
    }

    public User registration(User user){
        User user1 = userRepo.findByUsername(user.getUsername());
        if(user1 != null){
            throw new RuntimeException("User Already exist");
        } else {
            user.setPassword(encoder.encode(user.getPassword()));
            return userRepo.save(user);
        }

    }

    public Map<String , String> verify(User user) {
        Authentication authentication =
                authManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                user.getPassword()
                        )
                );
        if(authentication.isAuthenticated()) {
            String accessToken = jwTservice.generateAccessToken(user.getUsername());
            String refreshToken = jwTservice.generateRefreshToken(user.getUsername());
            Map<String , String > tokens = new HashMap<>();
            tokens.put("accessToken",accessToken);
            tokens.put("refreshToken", refreshToken);
            return tokens;

        }

        throw new RuntimeException("Invalid Username or Password");
    }
}
