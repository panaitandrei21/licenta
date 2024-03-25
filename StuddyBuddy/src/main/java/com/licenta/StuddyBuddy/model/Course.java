package com.licenta.StuddyBuddy.model;

import jakarta.persistence.*;
import lombok.*;

import java.nio.file.Files;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String courseId;

    private String courseName;
    private String description;

    private String category;
    private String logo;

    @ManyToMany
    List<User> teachers;

    @ManyToMany
    List<User> students;
}
