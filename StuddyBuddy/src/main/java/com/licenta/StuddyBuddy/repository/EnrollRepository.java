package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.Enroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollRepository extends JpaRepository<Enroll, String> {
}
