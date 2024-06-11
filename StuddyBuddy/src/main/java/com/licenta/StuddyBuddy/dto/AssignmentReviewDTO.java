package com.licenta.StuddyBuddy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.licenta.StuddyBuddy.model.Course;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AssignmentReviewDTO {
    private String feedback;
    private Double grade;
    private UserDTO studentName;
    private CourseDTO courseDTO;

}
