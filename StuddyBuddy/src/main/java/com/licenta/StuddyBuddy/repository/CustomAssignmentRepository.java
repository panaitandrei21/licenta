package com.licenta.StuddyBuddy.repository;


import com.licenta.StuddyBuddy.model.Assignment;
import com.licenta.StuddyBuddy.dto.SearchAssignmentsDTO;

import java.util.List;

public interface CustomAssignmentRepository {
    List<Assignment> findAssignmentsByCriteria(SearchAssignmentsDTO dto, Long page, Long pageSize);
    long countAssignmentsByCriteria(SearchAssignmentsDTO dto);
}
