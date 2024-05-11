package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String> {
}
