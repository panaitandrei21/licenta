package com.licenta.StuddyBuddy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AssignmentSubmissionDTO {
    private String submissionId;
    private String submittedFilePath;
    private LocalDateTime submissionDate;
    private String assignmentInstanceId;
    private String assignmentInstanceName;
    private UserDTO user;
}
