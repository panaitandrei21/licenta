package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.getAllUsers();
    }

    public String deleteUser(String user) {
        userRepository.delete(userRepository.findByUserId(user));
        return "User is deleted succesfully";
    }
}
