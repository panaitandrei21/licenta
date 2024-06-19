package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.AuthenticationResponse;
import com.licenta.StuddyBuddy.dto.EnrollRequest;
import com.licenta.StuddyBuddy.dto.RegisterRequest;
import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.service.AuthenticationService;
import com.licenta.StuddyBuddy.service.CourseService;
import com.licenta.StuddyBuddy.service.EnrollService;
import com.licenta.StuddyBuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final EnrollService enrollService;

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
        List<Course> courses = courseService.getAllCoursesAdmin();
        return ResponseEntity.ok(courses);
    }
    @PostMapping("/enroll-user-to-course")
    public ResponseEntity<?> enrollUserToCourse(@RequestBody EnrollRequest enrollRequest) {
        try {
            enrollService.enrollUser(enrollRequest.getUserId(), enrollRequest.getCourseId());
            Map<String, String> response = new HashMap<>();
            response.put("message", "User have been enrolled succesfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error enrolling user: " + e.getMessage());
        }
    }
    @PutMapping("/update/user")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO user) {

        try {
            userService.updateUserProfile(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User have been updated succesfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("User profile updated: " + e.getMessage());
        }
    }
    @PutMapping("/update/course")
    public ResponseEntity<?> updateCourse(@RequestBody Course course) {

        try {
            courseService.updateCourse(course);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course have been updated succesfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("User profile updated: " + e.getMessage());
        }
    }
    @DeleteMapping("/users/{userId}/courses/{courseId}")
    public ResponseEntity<?> removeUserFromCourse(@PathVariable String userId, @PathVariable String courseId) {
        try {
            int deletedCount = enrollService.removeUserFromCourse(userId, courseId);
            if (deletedCount > 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Course successfully removed from user");
                return ResponseEntity.ok().body(response);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No enrollment record found for the specified user and course.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error removing course from user: " + e.getMessage());
        }
    }
    @DeleteMapping("/delete/course/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable String courseId) throws Exception {
        courseService.deleteCourse(courseId);
        Map<String, String> response = new HashMap<>();
        response.put("response", "Course deleted successfully");
        return ResponseEntity.ok(response);
    }
}
