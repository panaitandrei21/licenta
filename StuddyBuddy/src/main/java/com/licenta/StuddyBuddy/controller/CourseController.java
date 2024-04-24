package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.ModuleRequest;
import com.licenta.StuddyBuddy.model.FileDescriptions;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.service.CourseService;
import com.licenta.StuddyBuddy.service.EnrollService;
import com.licenta.StuddyBuddy.service.FileDescriptionsService;
import com.licenta.StuddyBuddy.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

import static java.nio.file.Paths.get;
import static java.nio.file.Files.copy;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {
    public static final Path DIRECTORY = Path.of("upload");

    private final EnrollService enrollService;
    private final CourseService courseService;
    private final ModuleService moduleService;
    private final FileDescriptionsService descriptionsService;

    @GetMapping("/users/{userEmail}/courses")
    public ResponseEntity<?> getCoursesForUser(@PathVariable String userEmail) {
        return ResponseEntity.ok(enrollService.getCoursesForUser(userEmail));
    }
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("moduleId") String moduleId) throws IOException {

        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (filename.contains("..")) {
            return ResponseEntity.badRequest().body("Sorry! Filename contains invalid path sequence " + filename);
        }

        try {
            Path targetLocation = DIRECTORY.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/download/")
                    .path(filename)
                    .toUriString();
            System.out.println(fileDownloadUri);
            Optional<Module> optionalModule = moduleService.getModuleByModuleId(moduleId);
            if (optionalModule.isPresent()) {
                Module module = optionalModule.get();
                FileDescriptions fileDescriptions = descriptionsService.saveFileDescription(FileDescriptions.builder()
                        .filePath(filename)
                        .module(module)
                        .build());
                module.getFilePath().add(fileDescriptions);
                moduleService.saveModule(module);
                Map<String, String> response = new HashMap<>();
                response.put("message", "File uploaded successfully");
                response.put("fileUri", fileDownloadUri);
                return ResponseEntity.ok().body(response);
            } else {
                return ResponseEntity.notFound().header("Module with ID " + moduleId + " not found!").build();
            }
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body("Could not store file " + filename + ". Please try again!");
        }
    }
    @PostMapping("/add/module")
    public ResponseEntity<?> addModule(@RequestBody ModuleRequest moduleRequest) throws ChangeSetPersister.NotFoundException {
        moduleService.addModuleToCourse(moduleRequest);
        return ResponseEntity.ok().body("success");
    }
    @GetMapping("/get/modules")
    public ResponseEntity<?> getAllModules(@RequestParam String courseId) throws ChangeSetPersister.NotFoundException {

        return ResponseEntity.ok().body(moduleService.getAllModules(courseId));
    }

    @GetMapping("download/{filename}")
    public ResponseEntity<Resource> downloadFiles(@PathVariable String filename) throws IOException {
        Path filePath = get(DIRECTORY.toUri()).toAbsolutePath().normalize().resolve(filename);
        if(!Files.exists(filePath)) {
            throw new FileNotFoundException(filename + " was not found on the server");
        }
        Resource resource = new UrlResource(filePath.toUri());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("File-Name", filename);
        httpHeaders.add(CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                .headers(httpHeaders).body(resource);
    }
}
