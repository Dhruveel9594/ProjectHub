package com.example.ProjectHub.Repository;

import com.example.ProjectHub.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepo extends JpaRepository<Project, Long> {
    @Query("SELECT COUNT(DISTINCT p.department) FROM Project p WHERE p.department IS NOT NULL AND p.department <> ''")
    long countDistinctDepartments();
    List<Project> findByStudentUsername(String username);
    List<Project> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrTechStackContainingIgnoreCase(String title, String description, String techStack);
    List<Project> findByDepartmentAndYearAndTagAndProjectType(String department, String year, String tag, String projectType);
    List<Project> findTop10ByOrderByBookmarkCountDesc();
    List<Project> findTop10ByOrderByRatingDesc();
}
