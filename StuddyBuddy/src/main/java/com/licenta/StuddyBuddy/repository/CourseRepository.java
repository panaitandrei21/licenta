package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.licenta.StuddyBuddy.model.Course;
@Repository
public interface CourseRepository extends JpaRepository<Course, String > {
    public Course findByCourseId(String id);
}
