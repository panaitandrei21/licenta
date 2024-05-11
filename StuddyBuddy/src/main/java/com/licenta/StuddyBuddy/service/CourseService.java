package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.CourseDTO;
import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    public void addCourse(Course course) {
        courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
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
    private byte[] resizeImage(byte[] originalImage, int targetWidth, int targetHeight) throws IOException {
        ByteArrayInputStream inStream = new ByteArrayInputStream(originalImage);
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        Thumbnails.of(inStream)
                .size(targetWidth, targetHeight)
                .outputFormat("JPEG")
                .toOutputStream(outStream);
        return outStream.toByteArray();
    }
}
