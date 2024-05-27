package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.AssignmentDTO;
import com.licenta.StuddyBuddy.dto.AssignmentSubmissionDTO;
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
import java.util.List;
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
    public AssignmentDTO getAssignmentInstanceById(@PathVariable String assignmentInstanceId) {
        AssignmentDTO assignmentDTO = assignmentInstanceService.getAssignmentInstanceMetadata(assignmentInstanceId);
        try (InputStream assignmentContent = assignmentService.getAssignmentContent(assignmentDTO.getAssignmentId())) {
            assignmentDTO.setContent(assignmentContent != null ? IOUtils.toByteArray(assignmentContent) : new byte[]{});
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
        Optional<AssignmentSubmission> latestSubmission = assignmentSubmissionService.findLatestByAssignmentInstanceIdAndUsername(assignmentInstanceId, user.getUserId());
        return latestSubmission.map(submission -> ResponseEntity.ok(submission.getSubmittedFilePath()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/submissions/{assignmentInstanceId}")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getSubmissionsByAssignmentInstance(
            @PathVariable String assignmentInstanceId) {
        List<AssignmentSubmissionDTO> submissions = assignmentSubmissionService.getSubmissionsByAssignmentInstance(assignmentInstanceId);
        return ResponseEntity.ok(submissions);
    }

}
