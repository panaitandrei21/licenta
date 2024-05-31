package com.licenta.StuddyBuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String submissionId;

    private String submittedFilePath;
    private LocalDateTime submissionDate;

    @ManyToOne
    @JoinColumn(name = "assignment_instance_id")
    @JsonBackReference("assignmentInstance-submission")
    private AssignmentInstance assignmentInstance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double grade;
    private String feedback;
}
