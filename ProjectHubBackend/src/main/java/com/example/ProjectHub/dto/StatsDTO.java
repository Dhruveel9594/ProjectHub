package com.example.ProjectHub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * StatsDTO — returned by GET /api/stats
 * Contains platform-wide aggregate counts.
 */
@Getter
@AllArgsConstructor
public class StatsDTO {

    private long studentCount;    // total registered users
    private long projectCount;    // total uploaded projects
    private long collegeCount;    // distinct colleges across all users
    private long departmentCount; // distinct departments across all projects
}