package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.dto.CourseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.licenta.StuddyBuddy.model.Course;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    public Course findByCourseId(String id);
    @Query("SELECT new com.licenta.StuddyBuddy.dto.CourseDTO(c.courseId, c.courseName, c.description, c.category) FROM Course c where c.courseId = :courseId")
    public CourseDTO getCourseByIdToDTO (@Param("courseId") String courseId);
    @Query("SELECT c FROM Course c WHERE c.courseId NOT IN (SELECT e.course.courseId FROM Enroll e WHERE e.user.email = :email)")
    List<Course> findCoursesUserIsNotEnrolledTo(@Param("email") String email);
}
