package com.example.ProjectHub.Service;

import com.example.ProjectHub.Repository.ProjectRepo;
import com.example.ProjectHub.Repository.ReferenceRepo;
import com.example.ProjectHub.Repository.UserRepo;
import com.example.ProjectHub.entity.Project;
import com.example.ProjectHub.entity.Reference;
import com.example.ProjectHub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReferenceService {

    @Autowired
    private ReferenceRepo referenceRepo;

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private UserRepo userRepo;

    // Add reference/recommendation to a project
    public Reference addReference(Long projectId, String username, Reference reference) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        User givenBy = userRepo.findByUsername(username);
        if (givenBy == null) throw new RuntimeException("User not found: " + username);

        reference.setProject(project);
        reference.setGivenBy(givenBy);
        reference.setCreatedAt(LocalDateTime.now());

        // Update project rating if rating is provided
        if (reference.getRating() != null) {
            List<Reference> existing = referenceRepo.findByProjectId(projectId);
            double avgRating = (existing.stream()
                    .filter(r -> r.getRating() != null)
                    .mapToInt(Reference::getRating)
                    .sum() + reference.getRating()) / (double)(existing.size() + 1);
            project.setRating(avgRating);
            projectRepo.save(project);
        }

        return referenceRepo.save(reference);
    }

    // Get all references for a project
    public List<Reference> getByProject(Long projectId) {
        if (!projectRepo.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        List<Reference> refs = referenceRepo.findByProjectId(projectId);
        if (refs.isEmpty()) throw new RuntimeException("No references found for project: " + projectId);
        return refs;
    }

    // Get all references given by a user
    public List<Reference> getByUser(String username) {
        User user = userRepo.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found: " + username);
        List<Reference> refs = referenceRepo.findByGivenByUsername(username);
        if (refs.isEmpty()) throw new RuntimeException("No references given by: " + username);
        return refs;
    }

    // Delete a reference
    public void deleteReference(Long id) {
        if (!referenceRepo.existsById(id)) {
            throw new RuntimeException("Reference not found with id: " + id);
        }
        referenceRepo.deleteById(id);
    }
}
