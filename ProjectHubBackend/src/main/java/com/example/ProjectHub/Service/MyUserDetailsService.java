package com.example.ProjectHub.Service;

import com.example.ProjectHub.entity.User;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.UserPrincipal;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        User user1 = userRepo.findByUsername(username);
        if(user1 == null){
            System.out.println("No User Found");
            throw new UsernameNotFoundException("User Not Found");
        }
        System.out.println(user1);
        return new UserPrincipal(user1);
    }



}
