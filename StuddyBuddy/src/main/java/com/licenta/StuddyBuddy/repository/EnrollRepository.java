package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.model.Enroll;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollRepository extends JpaRepository<Enroll, String> {

    @Query("SELECT e.course FROM Enroll e WHERE e.user.email = :email")
    List<Course> findCoursesByUserEmail(@Param("email") String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM Enroll e WHERE e.user.userId = :userId AND e.course.courseId = :courseId")
    int deleteByUserIdAndCourseId(@Param("userId") String userId, @Param("courseId") String courseId);

}
