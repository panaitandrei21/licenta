package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.*;
import com.licenta.StuddyBuddy.model.AssignmentInstance;
import com.licenta.StuddyBuddy.model.FileDescriptions;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.model.User;
import com.licenta.StuddyBuddy.service.*;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {
    public static final Path DIRECTORY = Path.of("upload");
    private final UserService userService;

    private final EnrollService enrollService;
    private final ModuleService moduleService;
    private final FileDescriptionsService descriptionsService;
    private final CourseService courseService;
    private final AssignmentService assignmentService;
    private final AssignmentInstanceService assignmentInstanceService;
    private final FileStorageService fileStorageService;

    @PutMapping("/edit/assignment/{assignmentId}")
    public ResponseEntity<?> editAssignment(
            @PathVariable("assignmentId") String assignmentId,
            @RequestPart("assignment") AssignmentDTO assignmentDTO,
            @RequestPart(value = "files", required = false) MultipartFile file,
            @RequestPart(value = "solutionFiles", required = false) MultipartFile solutionFiles) throws IOException {

        return ResponseEntity.status(HttpStatus.OK).body(assignmentService.editAssignment(assignmentId, assignmentDTO, file, solutionFiles));

    }
    @DeleteMapping("/delete/assignment/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(@PathVariable String assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        Map<String, String> res = new HashMap<>();
        res.put("response", "Assignment deleted successfully");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/add/homework/{moduleId}")
    public ResponseEntity<?> addHomeworkToModule(@PathVariable String moduleId, @RequestBody HomeworkRequest homeworkRequest) {
        System.out.println("addHomeworkToModule called with moduleId: " + moduleId);

        AssignmentInstance assignmentInstance = assignmentInstanceService.addAssignemntInstance(moduleId, homeworkRequest);
        return ResponseEntity.ok(assignmentInstance);
    }
    @GetMapping("/get/assignment/{assignmentId}")
    public AssignmentDTO getAssignmentById(@PathVariable String assignmentId) {
        AssignmentDTO assignmentDTO = assignmentService.getAssignmentMetadata(assignmentId);
        try (InputStream assignmentContent = assignmentService.getAssignmentContent(assignmentId)) {
            assignmentDTO.setContent(assignmentContent != null ? IOUtils.toByteArray(assignmentContent) : new byte[]{});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try (InputStream assignmentSolution = assignmentService.getAssignmentSolution(assignmentId)) {
            assignmentDTO.setSolution(assignmentSolution != null ? IOUtils.toByteArray(assignmentSolution) : new byte[]{});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return assignmentDTO;
    }
    @PostMapping("/add/assignment")
    public ResponseEntity<?> addAssignment(
            @RequestPart("assignment") AssignmentDTO assignmentDTO,
            @RequestPart(value = "files", required = false) MultipartFile file,
            @RequestPart(value = "solutionFiles", required = false) MultipartFile solutionFiles) throws IOException {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(assignmentService.addAssignment(assignmentDTO, file, userDetails, solutionFiles));
    }
    @GetMapping ("/get/assignments")
    ResponseEntity<?> getAssignments(
            @RequestParam(name = "page", required = false, defaultValue = "0") Long page,
            @ModelAttribute SearchAssignmentsDTO searchAssignmentsDTO) {
        System.out.println(searchAssignmentsDTO);
        long totalRecords = assignmentService.countAssignments(searchAssignmentsDTO);
        long totalPages = (totalRecords + 20 - 1) / 20;
        SearchResultsPageDTO searchResultsPageDTO = new SearchResultsPageDTO();
        List<AssignmentDTO> searchResults = assignmentService.getAllAssignments(searchAssignmentsDTO, page, 20L);
        searchResultsPageDTO.setTotalPages(totalPages);
        searchResultsPageDTO.setAssignments(searchResults);
        return ResponseEntity.ok(searchResultsPageDTO);

    }
    @PutMapping("/edit/module")
    public ResponseEntity<?> editModule(@RequestBody ModuleResponse moduleResponse) throws Exception {
        Map<String, String> response = new HashMap<>();
        response.put("response", moduleService.editModule(moduleResponse));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userEmail}/courses")
    public ResponseEntity<?> getCoursesForUser(@PathVariable String userEmail) {
        return ResponseEntity.ok(enrollService.getCoursesForUser(userEmail));
    }
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("moduleId") String moduleId,
            @RequestParam("courseId") String courseId) {
        try {
            String uniqueFilename = fileStorageService.storeFile(file, courseId);

            Optional<Module> optionalModule = moduleService.getModuleByModuleId(moduleId);
            if (optionalModule.isPresent()) {
                Module module = optionalModule.get();
                FileDescriptions fileDescriptions = descriptionsService.saveFileDescription(FileDescriptions.builder()
                        .filePath(uniqueFilename)
                        .module(module)
                        .build());
                module.getFilePath().add(fileDescriptions);
                Module updatedModule = moduleService.saveModule(module);
                return ResponseEntity.ok().body(updatedModule);
            } else {
                return ResponseEntity.notFound().header("Module with ID " + moduleId + " not found!").build();
            }
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body("Could not store file. Please try again!");
        }
    }
    @PostMapping("/add/module")
    public ResponseEntity<?> addModule(@RequestBody ModuleRequest moduleRequest) throws ChangeSetPersister.NotFoundException {
        moduleService.addModuleToCourse(moduleRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Module added successfully");
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/get/modules")
    public ResponseEntity<?> getAllModules(@RequestParam String courseId) {
        return ResponseEntity.ok().body(moduleService.getAllModules(courseId));
    }

    @GetMapping("download/{filename}")
    public ResponseEntity<Resource> downloadFiles(@PathVariable String filename) throws IOException {
        Path filePath = DIRECTORY.toAbsolutePath().normalize().resolve(filename);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException(filename + " was not found on the server");
        }
        Resource resource = new UrlResource(filePath.toUri());
        String encodedFilename = URLEncoder.encode(Objects.requireNonNull(resource.getFilename()), StandardCharsets.UTF_8);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("File-Name", encodedFilename);
        httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + encodedFilename + "\"");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                .headers(httpHeaders)
                .body(resource);
    }
    @GetMapping("get/module/{moduleId}")
    public ResponseEntity<?> getModule(@PathVariable String moduleId) {
        return moduleService.getModuleByModuleId(moduleId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("get/course/details/{courseId}")
    public ResponseEntity<?> getCourseDetails(@PathVariable String courseId) {
        return ResponseEntity.ok(courseService.getCourseByCourseId(courseId));
    }
    @DeleteMapping("/delete/module/{moduleId}")
    @Secured("ROLE_TEACHER")
    public ResponseEntity<?> deleteModule(@PathVariable String moduleId) throws Exception {
        moduleService.deleteModule(moduleId);
        Map<String, String> response = new HashMap<>();
        response.put("response", "Module deleted succesfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/file/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileId) throws Exception {
        descriptionsService.deleteFileDescription(fileId);
        Map<String, String> response = new HashMap<>();
        response.put("response", "Module deleted succesfully");
        return ResponseEntity.ok(response);
    }
    @PostMapping("/photo/{courseId}")
    public ResponseEntity<?> addPhotoToCourse(@PathVariable String courseId, @RequestParam("imageData") MultipartFile imageData) throws IOException {
        courseService.updateCourseImage(courseId, imageData);
        Map<String, String> response = new HashMap<>();
        response.put("response", "Photo updated succesfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/all/courses")
    public ResponseEntity<?> getAllCourses() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.findUser(userDetails.getUsername());
        return ResponseEntity.ok(courseService.getAllCourses(user.getEmail()));
    }
    @GetMapping("/enroll-user-to-course/{courseId}")
    public ResponseEntity<?> enrollUserToCourse(@PathVariable String courseId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.findUser(userDetails.getUsername());
        try {
            enrollService.enrollUser(user.getUserId(), courseId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User have been enrolled succesfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error enrolling user: " + e.getMessage());
        }
    }
}
