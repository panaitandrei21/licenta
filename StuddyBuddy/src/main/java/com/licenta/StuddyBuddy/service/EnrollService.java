package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.model.Enroll;
import com.licenta.StuddyBuddy.repository.CourseRepository;
import com.licenta.StuddyBuddy.repository.EnrollRepository;
import com.licenta.StuddyBuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollService {
    private final EnrollRepository enrollRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public Enroll enrollUser(String userId, String courseId) {
        Enroll enroll = Enroll.builder()
                .user(userRepository.findByUserId(userId))
                .course(courseRepository.findByCourseId(courseId))
                .build();
       return enrollRepository.save(enroll);
    }

    public List<Course> getCoursesForUser(String userEmail) {
        return enrollRepository.findCoursesByUserEmail(userEmail);
    }

    public int removeUserFromCourse(String userId, String courseId) {
        return enrollRepository.deleteByUserIdAndCourseId(userId, courseId);
    }
}
