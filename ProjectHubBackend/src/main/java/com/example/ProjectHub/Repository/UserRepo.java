package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

    //  used for login and loadUserByUsername
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);
}