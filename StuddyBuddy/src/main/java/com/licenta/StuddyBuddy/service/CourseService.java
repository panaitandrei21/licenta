package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.CourseDTO;
import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.model.User;
import com.licenta.StuddyBuddy.repository.CourseRepository;
import com.licenta.StuddyBuddy.repository.EnrollRepository;
import com.licenta.StuddyBuddy.repository.ModuleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final EnrollRepository enrollRepository;
    public void addCourse(Course course) {
        courseRepository.save(course);
    }

    public List<Course> getAllCoursesAdmin() {
        return courseRepository.findAll();
    }
    public List<CourseDTO> getAllCourses(String email) {
        List<Course> courses = courseRepository.findCoursesUserIsNotEnrolledTo(email);
        return courses.stream()
                .map(this::convertToCourseDTO)
                .collect(Collectors.toList());
    }
    public Course findByCourseId(String courseId) {
        return courseRepository.findByCourseId(courseId);
    }

    public CourseDTO getCourseByCourseId(String courseId) {
        return courseRepository.getCourseByIdToDTO(courseId);
    }

    public boolean updateCourseImage(String courseId, MultipartFile file) throws IOException {
        Course course = courseRepository.findByCourseId(courseId);
        if (course != null) {
            course.setLogo(file.getBytes());
            courseRepository.save(course);
            return true;
        }
        return false;
    }

    @Transactional
    public void deleteCourse(String courseId) {
        enrollRepository.deleteByCourse_CourseId(courseId);

        moduleRepository.deleteByCourse_CourseId(courseId);

        courseRepository.deleteById(courseId);
    }

    public void updateCourse(Course course) {
        Course existingCourse = courseRepository.findByCourseId(course.getCourseId());

        if (existingCourse != null) {
            if (!existingCourse.getCourseName().equals(course.getCourseName()))
                course.setCourseName(course.getCourseName());
            if (!existingCourse.getCategory().equals(course.getCategory()))
                existingCourse.setCategory(course.getCategory());
            if (!existingCourse.getDescription().equals(course.getDescription()))
                existingCourse.setDescription(course.getDescription());
            courseRepository.save(existingCourse);
        }
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
