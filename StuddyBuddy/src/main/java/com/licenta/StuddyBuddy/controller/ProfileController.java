package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final UserService userService;
    @GetMapping("/details")
    public ResponseEntity<?> getUserProfile(@RequestParam("email") String email) {
        return ResponseEntity.ok(userService.getUserDetails(email));
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserDTO toUpdate) {
        return ResponseEntity.ok().body(userService.updateUserProfile(toUpdate));
    }
}
