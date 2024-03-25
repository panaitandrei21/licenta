package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.AuthenticationResponse;
import com.licenta.StuddyBuddy.dto.RegisterRequest;
import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.service.AuthenticationService;
import com.licenta.StuddyBuddy.service.CourseService;
import com.licenta.StuddyBuddy.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final CourseService courseService;
    @GetMapping
    public String getAdmin() {
        return "admin aici";
    }
    @PostMapping("/add/teacher")
    public ResponseEntity<AuthenticationResponse> addTeacher(@RequestBody RegisterRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.registerTeacher(request);
        return ResponseEntity.ok(authenticationResponse);
    }
    @GetMapping("/getTeachers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);

    }

    @DeleteMapping("/deleteUsers")
    public ResponseEntity<?> deleteUser(@RequestBody List<UserDTO> users) {
        for (UserDTO user : users) {
            userService.deleteUser(user.getId());
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Users have been deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create/course")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        courseService.addCourse(course);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Users have been deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/courses")
    public ResponseEntity<?> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

}
