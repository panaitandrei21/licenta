package com.licenta.StuddyBuddy.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class SearchAssignmentsDTO {
    private String assignmentId;
    private String category;
    private String title;
    private String createdBy;
    private LocalDate createdDate;
}
