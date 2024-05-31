package com.licenta.StuddyBuddy.repository;


import com.licenta.StuddyBuddy.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, String> {
    List<Module> findByCourseCourseId(String courseId);

    void deleteByCourse_CourseId(String courseId);
}
