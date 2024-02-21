package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, String> {

}
