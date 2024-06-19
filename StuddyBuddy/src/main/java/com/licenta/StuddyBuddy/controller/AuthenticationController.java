package com.licenta.StuddyBuddy.controller;

import com.licenta.StuddyBuddy.model.User;
import com.licenta.StuddyBuddy.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.licenta.StuddyBuddy.dto.AuthenticationResponse;
import com.licenta.StuddyBuddy.dto.RegisterRequest;
import com.licenta.StuddyBuddy.dto.AuthenticationRequest;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody RegisterRequest request
    ) {
        AuthenticationResponse authenticationResponse = authenticationService.register(request);
        if(authenticationResponse.getToken() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    authenticationResponse
            );
        }
    return ResponseEntity.ok(authenticationResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody AuthenticationRequest request
    ) {
        return authenticationService.login(request);
    }

    @PostMapping("/validToken")
    public ResponseEntity<String> checkUserLoggedIn(
            @RequestParam("token") String token,
            @RequestParam("user") User user
            ) {
       Boolean isAuthenticated = authenticationService.checkUserLoggedIn(token, user);
       if (isAuthenticated) {
           return ResponseEntity.ok("User is Logged in");
       }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                "User is not logged in"
        );
    }
}
