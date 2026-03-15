package com.example.ProjectHub.repository;

import com.example.ProjectHub.entity.Reference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferenceRepo extends JpaRepository<Reference, Long> {
    List<Reference> findByProjectId(Long projectId);
    List<Reference> findByGivenByUsername(String username);
}
