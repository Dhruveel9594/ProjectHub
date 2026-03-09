package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

    public User findByUsername(String username);
}
