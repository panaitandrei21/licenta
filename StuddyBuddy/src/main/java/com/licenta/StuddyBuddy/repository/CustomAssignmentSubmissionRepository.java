package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.AssignmentSubmission;
import com.licenta.StuddyBuddy.dto.SearchSubmissionsDTO;

import java.util.List;

public interface CustomAssignmentSubmissionRepository {
    List<AssignmentSubmission> findSubmissionsByCriteria(SearchSubmissionsDTO dto, Long page, Long pageSize);
    long countSubmissionsByCriteria(SearchSubmissionsDTO dto);
}
