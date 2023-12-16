package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.model.FileNames;
import com.licenta.StuddyBuddy.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.licenta.StuddyBuddy.model.Course;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    public void addCourse() {
        List<FileNames> fileNames = new ArrayList<>();
        fileNames.add(FileNames.builder().file("smecherie").build());
        Course course = Course.builder().coursesFilenames(fileNames).build();
        courseRepository.save(course);
    }

}
