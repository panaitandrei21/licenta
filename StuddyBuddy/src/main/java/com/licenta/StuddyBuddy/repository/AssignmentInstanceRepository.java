package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.AssignmentInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentInstanceRepository  extends JpaRepository<AssignmentInstance, String> {
}
