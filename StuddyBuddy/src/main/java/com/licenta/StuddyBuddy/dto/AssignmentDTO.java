package com.licenta.StuddyBuddy.dto;

import com.licenta.StuddyBuddy.model.AssignmentSubmission;
import com.licenta.StuddyBuddy.model.Module;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {

    private String moduleId;
    private String assignmentId;

    private String title;
    private String description;
    private LocalDateTime dueDate;

    private Module module;

    private List<AssignmentSubmission> submissions;
}
