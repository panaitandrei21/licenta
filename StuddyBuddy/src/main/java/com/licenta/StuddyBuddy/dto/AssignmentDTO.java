package com.licenta.StuddyBuddy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AssignmentDTO {
    public AssignmentDTO(String assignmentId, String category, String title, User createdBy, Instant createdDate) {
        this.assignmentId = assignmentId;
        this.category = category;
        this.title = title;
        this.createdBy = createdBy.getEmail();
        this.createdDate = Date.from(createdDate);
    }

    private String assignmentId;
    private String category;

    private byte[] content;

    private byte[] solution;
    private String title;
    private String createdBy;
    private LocalDateTime dueDate;
    private Date createdDate;

}
