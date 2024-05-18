package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.AssignmentDTO;
import com.licenta.StuddyBuddy.dto.SearchAssignmentsDTO;
import com.licenta.StuddyBuddy.exception.AssignmentNotFoundException;
import com.licenta.StuddyBuddy.model.Assignment;
import com.licenta.StuddyBuddy.repository.AssignmentRepository;
import com.licenta.StuddyBuddy.repository.AssignmentSubmissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final UserService userService;

    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final ModuleService moduleService;

    @Transactional
    public Assignment addAssignment(AssignmentDTO assignmentDTO, MultipartFile file, UserDetails userDetails) throws IOException {
            Assignment assignment = Assignment.builder()
                    .title(assignmentDTO.getTitle())
                    .content(file.getBytes())
                    .createdDate(Instant.now())
                    .dueDate(assignmentDTO.getDueDate())
                    .category(assignmentDTO.getCategory())
                    .createdby(userService.findUser(userDetails.getUsername()))
                    .build();
            return assignmentRepository.save(assignment);

    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }
    public List<AssignmentDTO> getAllAssignments(SearchAssignmentsDTO dto, Long page, Long pageSize) {
        List<Assignment> assignments = assignmentRepository.findAssignmentsByCriteria(dto, page, pageSize);
        return assignments.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public long countAssignments(SearchAssignmentsDTO dto) {
        return assignmentRepository.countAssignmentsByCriteria(dto);
    }

    private AssignmentDTO mapToDTO(Assignment assignment) {
        return AssignmentDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .content(assignment.getContent())
                .title(assignment.getTitle())
                .createdDate(Date.from(assignment.getCreatedDate()))
                .createdBy(assignment.getCreatedby().getEmail())
                .category(assignment.getCategory())
                .build();
    }

    public AssignmentDTO getAssignmentById(String assignmentId) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(assignmentId);
        if (assignmentOpt.isPresent()) {
            return mapToDTO(assignmentOpt.get());
        }
        throw new AssignmentNotFoundException("Assignment not found for id: " + assignmentId);
    }

    public AssignmentDTO getAssignmentMetadata(String assignmentId) {
        AssignmentDTO assignmentDTO = assignmentRepository.getAssignmentMetadata(assignmentId);
        return assignmentDTO;
    }

    public InputStream getAssignmentContent(String assignmentDTO) {
        byte[] contentBytes = assignmentRepository.getAssignmentContent(assignmentDTO);
        return new ByteArrayInputStream(contentBytes);    }
}
