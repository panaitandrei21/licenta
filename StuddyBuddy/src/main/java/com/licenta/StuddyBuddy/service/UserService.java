package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.User;
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

    public UserDTO getUserDetails(String user) {
        return userRepository.getUserByEmail(user);
    }
    public User findUser(String user) {
        return userRepository.findByEmail(user);
    }

    public String updateUserProfile(UserDTO updatedUser) {
        User existingUser = userRepository.findByEmail(updatedUser.getEmail());

        if (existingUser != null) {
            if (!existingUser.getEmail().equals(updatedUser.getFirstName()))
                existingUser.setFirstName(updatedUser.getFirstName());
            if (!existingUser.getLastName().equals(updatedUser.getLastName()))
                existingUser.setLastName(updatedUser.getLastName());
            if (!existingUser.getEmail().equals(updatedUser.getEmail()))
                existingUser.setEmail(updatedUser.getEmail());
            if (!existingUser.getRole().equals(updatedUser.getRole()))
                existingUser.setRole(updatedUser.getRole());
            userRepository.save(existingUser);

            return "User updated succesfully";
        } else {
            return "User was not updated";
        }
    }

}
