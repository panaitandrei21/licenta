package com.licenta.StuddyBuddy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchSubmissionsDTO {
    private String assignmentInstanceId;
    private String studentLastName;
    private String studentFirstName;
    private String assignmentName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date submissionDate;

}
