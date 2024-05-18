package com.licenta.StuddyBuddy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchResultsPageDTO {
    private Long totalPages;
    private List<AssignmentDTO> assignments;
}
