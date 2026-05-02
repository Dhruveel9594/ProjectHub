package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.ProjectRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.dto.StatsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired private UserRepo    userRepo;
    @Autowired private ProjectRepo projectRepo;

    /**
     * Aggregates platform-wide stats from the database.
     * All counts default to 0 safely — never throws for empty tables.
     */
    public StatsDTO getStats() {
        long studentCount    = userRepo.count();
        long projectCount    = projectRepo.count();
        long collegeCount    = userRepo.countDistinctColleges();
        long departmentCount = projectRepo.countDistinctDepartments();

        return new StatsDTO(studentCount, projectCount, collegeCount, departmentCount);
    }
}