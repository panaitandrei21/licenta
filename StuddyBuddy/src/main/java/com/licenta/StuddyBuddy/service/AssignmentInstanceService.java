package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.AssignmentDTO;
import com.licenta.StuddyBuddy.dto.HomeworkRequest;
import com.licenta.StuddyBuddy.exception.ModuleNotFoundException;
import com.licenta.StuddyBuddy.model.Assignment;
import com.licenta.StuddyBuddy.model.AssignmentInstance;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.repository.AssignmentInstanceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentInstanceService {
    private final AssignmentService assignmentService;
    private final AssignmentInstanceRepository assignmentInstanceRepository;
    private final ModuleService moduleService;
    @Transactional
    public AssignmentInstance addAssignemntInstance(String moduleId, HomeworkRequest homeworkRequest) {
        Optional<Module> module = moduleService.getModuleByModuleId(moduleId);
        Assignment assignment = assignmentService.getAssignmentById(homeworkRequest.getAssignmentId());
        if (module.isEmpty())
            throw new ModuleNotFoundException("No module found with this id");

        return assignmentInstanceRepository.save(AssignmentInstance.builder()
                .module(module.get())
                .dueDate(homeworkRequest.getDueDate())
                .assignment(assignment)
                .build());
    }

}
