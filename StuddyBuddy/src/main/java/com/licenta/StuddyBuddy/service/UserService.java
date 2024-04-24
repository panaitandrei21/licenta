package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.User;
import com.licenta.StuddyBuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
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

    public UserDTO getUserDetails(String user) {
        return userRepository.getUserByEmail(user);
    }

    public String updateUserProfile(UserDTO updatedUser) {
        User existingUser = userRepository.findByEmail(updatedUser.getEmail());

        if (existingUser != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setEmail(updatedUser.getEmail());
            System.out.println(existingUser);
            userRepository.save(existingUser);

            return "User updated succesfully";
        } else {
            return "User was not updated";
        }
    }
}
