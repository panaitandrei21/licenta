package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.AuthenticationResponse;
import com.licenta.StuddyBuddy.dto.RegisterRequest;
import com.licenta.StuddyBuddy.model.Teacher;
import com.licenta.StuddyBuddy.repository.TeacherRepository;
import com.licenta.StuddyBuddy.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AuthenticationService authenticationService;
    @GetMapping
    public String getAdmin() {
        return "admin aici";
    }
    @PostMapping("/add/teacher")
    public ResponseEntity<AuthenticationResponse> addTeacher(@RequestBody RegisterRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.registerTeacher(request);
        return ResponseEntity.ok(authenticationResponse);
    }

}
