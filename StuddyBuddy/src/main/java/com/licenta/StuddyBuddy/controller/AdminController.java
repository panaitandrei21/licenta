package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.AuthenticationResponse;
import com.licenta.StuddyBuddy.dto.RegisterRequest;
import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.Teacher;
import com.licenta.StuddyBuddy.repository.TeacherRepository;
import com.licenta.StuddyBuddy.service.AuthenticationService;
import com.licenta.StuddyBuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AuthenticationService authenticationService;
    private final UserService userService;
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

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam String user) {
        String response = userService.deleteUser(user);
        return ResponseEntity.ok(response);

    }

}
