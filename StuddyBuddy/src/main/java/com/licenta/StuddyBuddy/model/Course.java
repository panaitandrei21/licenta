package com.licenta.StuddyBuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @OneToMany(mappedBy = "course")
    @JsonManagedReference
    private List<Module> modules;
}
