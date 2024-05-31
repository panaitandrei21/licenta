package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.AssignmentSubmissionDTO;
import com.licenta.StuddyBuddy.dto.SearchSubmissionsDTO;
import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.exception.AssignmentNotFoundException;
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


    public AssignmentSubmissionDTO findLatestByAssignmentInstanceIdAndUsername(String assignmentInstanceId, String userId) {
        AssignmentSubmission assignmentSubmissionOptional = submissionRepository.findSubmissionsByInstanceIdAndUsername(assignmentInstanceId, userId);



        return mapToDTO(assignmentSubmissionOptional);
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

        // Handle null values for grade and feedback
        Double grade = submission.getGrade() != null ? submission.getGrade() : 0.0;
        String feedback = submission.getFeedback() != null ? submission.getFeedback() : "No feedback";

        return new AssignmentSubmissionDTO(
                submission.getSubmissionId(),
                submission.getSubmittedFilePath(),
                submission.getSubmissionDate(),
                submission.getAssignmentInstance().getAssignmentInstanceId(),
                submission.getAssignmentInstance().getAssignment().getTitle(),
                userDTO,
                grade,
                feedback
        );
    }

    public AssignmentSubmissionDTO getSubmissionBySubmissionId(String submissionId) {
        Optional<AssignmentSubmission> assignmentSubmissionOptional = submissionRepository.findById(submissionId);
        if (assignmentSubmissionOptional.isEmpty())
            throw new AssignmentNotFoundException("AssignmentSubmission not found");

        return mapToDTO(assignmentSubmissionOptional.get());
    }

    public AssignmentSubmission addSubmissionReview(String submissionId, AssignmentSubmissionDTO assignmentSubmissionDTO) {
        Optional<AssignmentSubmission> assignmentSubmissionOptional = submissionRepository.findById(submissionId);
        if (assignmentSubmissionOptional.isEmpty())
            throw new AssignmentNotFoundException("AssignmentSubmission not found");

        AssignmentSubmission assignmentSubmission = assignmentSubmissionOptional.get();
        assignmentSubmission.setFeedback(assignmentSubmissionDTO.getFeedback());
        assignmentSubmission.setGrade(assignmentSubmissionDTO.getGrade());
        return submissionRepository.save(assignmentSubmission);
    }
}
