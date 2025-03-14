package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.dto.AssignmentDTO;
import com.licenta.StuddyBuddy.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String>, CustomAssignmentRepository {
    @Query("SELECT new com.licenta.StuddyBuddy.dto.AssignmentDTO(c.assignmentId, c.category, c.title, c.createdby, c.createdDate) FROM Assignment c where c.assignmentId = :assignmentId")
    AssignmentDTO getAssignmentMetadata(String assignmentId);

    @Query("SELECT c.content FROM Assignment c where c.assignmentId = :assignmentId")
    byte[] getAssignmentContent(String assignmentId);
    @Query("SELECT c.solution FROM Assignment c where c.assignmentId = :assignmentId")
    byte[] getAssignmentSolution(String assignmentId);
}
