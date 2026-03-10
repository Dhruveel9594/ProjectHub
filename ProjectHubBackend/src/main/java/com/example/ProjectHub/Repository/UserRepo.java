package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

    //  used for login and loadUserByUsername
    User findByUsername(String username);

    // need for duplicate email check during registration.
    User findByEmail(String email);
}