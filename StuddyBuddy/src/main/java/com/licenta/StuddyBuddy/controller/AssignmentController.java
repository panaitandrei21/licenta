package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.*;
import com.licenta.StuddyBuddy.model.AssignmentInstance;
import com.licenta.StuddyBuddy.model.AssignmentSubmission;
import com.licenta.StuddyBuddy.model.User;
import com.licenta.StuddyBuddy.service.*;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignment")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentSubmissionService assignmentSubmissionService;
    private final FileStorageService fileStorageService;
    private final AssignmentInstanceService assignmentInstanceService;
    private final AssignmentService assignmentService;
    private final UserService userService;

    @GetMapping("/get/assignmentInstance/{assignmentInstanceId}")
    public AssignmentInstanceResponse getAssignmentInstanceById(@PathVariable String assignmentInstanceId) {
        AssignmentInstanceResponse assignmentDTO = assignmentInstanceService.getAssignmentInstanceMetadata(assignmentInstanceId);
        try (InputStream assignmentContent = assignmentService.getAssignmentContent(assignmentDTO.getAssignment().getAssignmentId())) {
            assignmentDTO.getAssignment().setContent(assignmentContent != null ? IOUtils.toByteArray(assignmentContent) : new byte[]{});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return assignmentDTO;
    }

    @PostMapping("/submitAssignment")
    public ResponseEntity<?> submitAssignment(@RequestParam("file") MultipartFile file,
                                              @RequestParam("assignmentInstanceId") String assignmentInstanceId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();;
        User user = userService.findUser(userDetails.getUsername());
        try {
            String fileDownloadUri = fileStorageService.storeFile(file, user.getUserId());

            Optional<AssignmentInstance> optionalAssignmentInstance = assignmentInstanceService.getAssignmentInstanceById(assignmentInstanceId);
            if (optionalAssignmentInstance.isPresent()) {
                AssignmentInstance assignmentInstance = optionalAssignmentInstance.get();

                AssignmentSubmission submission = assignmentSubmissionService.createOrUpdateSubmission(AssignmentSubmission.builder()
                        .submittedFilePath(fileDownloadUri)
                        .submissionDate(LocalDateTime.now())
                        .assignmentInstance(assignmentInstance)
                        .user(user)
                        .build());

                return ResponseEntity.ok().body(submission);
            } else {
                return ResponseEntity.notFound().header("Assignment Instance with ID " + assignmentInstanceId + " not found!").build();
            }
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body("Could not store file. Please try again!");
        }
    }

    @GetMapping("/get/latestSubmission/{assignmentInstanceId}")
    public ResponseEntity<?> getLatestSubmissionFileName(@PathVariable String assignmentInstanceId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.findUser(userDetails.getUsername());
        AssignmentSubmissionDTO latestSubmission = assignmentSubmissionService.findLatestByAssignmentInstanceIdAndUsername(assignmentInstanceId, user.getUserId());


        return ResponseEntity.ok(latestSubmission.getSubmittedFilePath());
    }

    @GetMapping("/course/submissions")
    public ResponseEntity<?> searchSubmissions(
            @RequestParam(name = "page", required = false, defaultValue = "0") Long page,
            @ModelAttribute SearchSubmissionsDTO searchSubmissionsDTO) {

        long totalRecords = assignmentSubmissionService.countSubmissions(searchSubmissionsDTO);
        long totalPages = (totalRecords + 20 - 1) / 20;
        SearchSubmissionResultsDTO searchResultsPageDTO = new SearchSubmissionResultsDTO();
        List<AssignmentSubmissionDTO> searchResults = assignmentSubmissionService.searchSubmissions(searchSubmissionsDTO, page, 20L);
        searchResultsPageDTO.setTotalPages(totalPages);
        searchResultsPageDTO.setSubmissions(searchResults);

        return ResponseEntity.ok(searchResultsPageDTO);
    }
    @GetMapping("/get/submissions/{assignmentInstanceId}")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getSubmissionsByAssignmentInstance(
            @PathVariable String assignmentInstanceId) {
        List<AssignmentSubmissionDTO> submissions = assignmentSubmissionService.getSubmissionsByAssignmentInstance(assignmentInstanceId);
        return ResponseEntity.ok(submissions);
    }
    @GetMapping("/get/submission/{submissionId}")
    public ResponseEntity<?> getSubmission(
            @PathVariable String submissionId) {
        AssignmentSubmissionDTO submission = assignmentSubmissionService.getSubmissionBySubmissionId(submissionId);
        return ResponseEntity.ok(submission);
    }
    @PostMapping("/add/submission/review/{submissionId}")
    public ResponseEntity<?> addSubmission(
            @PathVariable String submissionId,
            @RequestBody AssignmentSubmissionDTO assignmentSubmissionDTO) {

        return ResponseEntity.ok(assignmentSubmissionService.addSubmissionReview(submissionId, assignmentSubmissionDTO));
    }
    @GetMapping("/get/assignment/solved/{submissionId}")
    public ResponseEntity<?> getAssignmentSolvedIfGraded(@PathVariable String submissionId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.findUser(userDetails.getUsername());
        AssignmentSubmissionDTO assignmentSubmission = assignmentSubmissionService.findLatestByAssignmentInstanceIdAndUsername(submissionId, user.getUserId());
        AssignmentSubmissionFeedback assignmentDTO = new AssignmentSubmissionFeedback();
        assignmentDTO.setGrade(assignmentSubmission.getGrade());
        assignmentDTO.setFeedback(assignmentSubmission.getFeedback());
        if (assignmentSubmission.getFeedback() != null) {
            try (InputStream assignmentContent = assignmentInstanceService.getAssignmentSolvedIfGraded(submissionId)) {
                assignmentDTO.setSolution(assignmentContent != null ? IOUtils.toByteArray(assignmentContent) : new byte[]{});
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return ResponseEntity.ok(assignmentDTO);
        }
        Map<String, String> response = new HashMap<>();
        response.put("response", "Assignment did not get feedback yet");
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/delete/assignmentInstance/{assignmentInstanceId}")
    public ResponseEntity<?> deleteAssignmentInstance(@PathVariable String assignmentInstanceId) {
        assignmentInstanceService.deleteAssignmentInstance(assignmentInstanceId);



        Map<String, String> response = new HashMap<>();
        response.put("response", "Assignment did not get feedback yet");
        return ResponseEntity.ok(response);
    }
}
