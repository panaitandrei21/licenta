package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.dto.UserDTO;
import com.licenta.StuddyBuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    public User findByEmail(String username);
    public User findByUserId(String id);
    @Query("SELECT new com.licenta.StuddyBuddy.dto.UserDTO(u.userId ,u.firstName, u.lastName, u.email, u.role) FROM User u")
    List<UserDTO> getAllUsers();

    @Query("SELECT new com.licenta.StuddyBuddy.dto.UserDTO(u.userId ,u.firstName, u.lastName, u.email, u.role) FROM User u where u.email = :email")
    public UserDTO getUserByEmail(String email);

}
