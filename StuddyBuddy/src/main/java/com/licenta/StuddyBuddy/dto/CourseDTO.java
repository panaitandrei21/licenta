package com.licenta.StuddyBuddy.dto;

import com.licenta.StuddyBuddy.model.Module;
import lombok.*;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class CourseDTO {

    public CourseDTO(String courseId, String courseName, String description, String category) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.description = description;
        this.category = category;
    }

    private String courseId;

    private String courseName;
    private String description;

    private String category;
    private String logo;

    private List<Module> modules;

}
