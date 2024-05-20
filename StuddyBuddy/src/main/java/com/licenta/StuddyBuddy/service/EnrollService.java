package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.CourseDTO;
import com.licenta.StuddyBuddy.dto.ModuleResponse;
import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.model.Enroll;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.repository.CourseRepository;
import com.licenta.StuddyBuddy.repository.EnrollRepository;
import com.licenta.StuddyBuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<CourseDTO> getCoursesForUser(String userEmail) {
        List<Course> courses = enrollRepository.findCoursesByUserEmail(userEmail);
        return courses.stream()
                .map(this::convertToCourseDTO)
                .collect(Collectors.toList());
    }

    public int removeUserFromCourse(String userId, String courseId) {
        return enrollRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    private String encodeToBase64(byte[] imageBytes) {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        return "data:image/jpeg;base64," + base64Image;
    }
    private CourseDTO convertToCourseDTO(Course course) {
        String base64Encoded = "";
        if (course.getLogo() != null) {
            base64Encoded = encodeToBase64(course.getLogo());
        }
        return new CourseDTO(
                course.getCourseId(),
                course.getCourseName(),
                course.getDescription(),
                course.getCategory(),
                base64Encoded,
                course.getModules()
        );
    }
}
