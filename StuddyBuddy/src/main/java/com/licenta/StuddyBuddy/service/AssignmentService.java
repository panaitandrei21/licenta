package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.AssignmentDTO;
import com.licenta.StuddyBuddy.exception.CustomException;
import com.licenta.StuddyBuddy.model.Assignment;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.repository.AssignmentRepository;
import com.licenta.StuddyBuddy.repository.AssignmentSubmissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final ModuleService moduleService;

    @Transactional
    public Assignment addAssignment(AssignmentDTO assigmentDTO) {
        Optional<Module> module = moduleService.getModuleByModuleId(assigmentDTO.getModuleId());
        if (module.isPresent()) {
            Assignment newAssignment = Assignment.builder()
                    .module(module.get())
                    .title(assigmentDTO.getTitle())
                    .description(assigmentDTO.getDescription())
                    .dueDate(assigmentDTO.getDueDate())
                    .build();
           return assignmentRepository.save(newAssignment);
        }
        throw new CustomException("No module with this ID", HttpStatus.NOT_FOUND);
    }
}
