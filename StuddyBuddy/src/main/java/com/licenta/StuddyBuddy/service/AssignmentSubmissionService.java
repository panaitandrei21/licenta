package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.AssignmentSubmissionDTO;
import com.licenta.StuddyBuddy.dto.SearchSubmissionsDTO;
import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.AssignmentSubmission;
import com.licenta.StuddyBuddy.model.User;
import com.licenta.StuddyBuddy.repository.AssignmentSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentSubmissionService {
    private final AssignmentSubmissionRepository submissionRepository;


    public AssignmentSubmission createOrUpdateSubmission(AssignmentSubmission submission) {
        Optional<AssignmentSubmission> existingSubmission = submissionRepository.findByAssignmentInstanceAndUser(
                submission.getAssignmentInstance(), submission.getUser());

        if (existingSubmission.isPresent()) {
            // Update the existing submission
            AssignmentSubmission updatedSubmission = existingSubmission.get();
            updatedSubmission.setSubmittedFilePath(submission.getSubmittedFilePath());
            updatedSubmission.setSubmissionDate(submission.getSubmissionDate());
            updatedSubmission.setFeedback(submission.getFeedback());
            updatedSubmission.setGrade(submission.getGrade());
            return submissionRepository.save(updatedSubmission);
        } else {
            // Save the new submission
            return submissionRepository.save(submission);
        }
    }


    public Optional<AssignmentSubmission> getSubmissionById(String submissionId) {
        return submissionRepository.findById(submissionId);
    }


    public Optional<AssignmentSubmission> findLatestByAssignmentInstanceIdAndUsername(String assignmentInstanceId, String userId) {
        return Optional.ofNullable(submissionRepository.findSubmissionsByInstanceIdAndUsername(assignmentInstanceId, userId));
    }
    public List<AssignmentSubmissionDTO> getSubmissionsByAssignmentInstance(String assignmentInstanceId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByAssignmentInstance_AssignmentInstanceId(assignmentInstanceId);
        return submissions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<AssignmentSubmissionDTO> searchSubmissions(SearchSubmissionsDTO dto, Long page, Long pageSize) {
        List<AssignmentSubmission> submissions = submissionRepository.findSubmissionsByCriteria(dto, page, pageSize);
        return submissions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public long countSubmissions(SearchSubmissionsDTO dto) {
        return submissionRepository.countSubmissionsByCriteria(dto);
    }

    private AssignmentSubmissionDTO mapToDTO(AssignmentSubmission submission) {
        UserDTO userDTO = UserDTO.builder()
                .firstName(submission.getUser().getFirstName())
                .id(submission.getUser().getUserId())
                .email(submission.getUser().getEmail())
                .lastName(submission.getUser().getLastName())
                .build();
        return new AssignmentSubmissionDTO(
                submission.getSubmissionId(),
                submission.getSubmittedFilePath(),
                submission.getSubmissionDate(),
                submission.getAssignmentInstance().getAssignmentInstanceId(),
                submission.getAssignmentInstance().getAssignment().getTitle(),
                userDTO
        );
    }
}
