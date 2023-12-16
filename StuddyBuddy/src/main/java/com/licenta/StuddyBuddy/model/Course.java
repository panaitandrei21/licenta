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
    @OneToMany
    private List<Homework> homeworkList;
    @OneToOne
    private Teacher teacher;
    @OneToMany
    private List<FileNames> coursesFilenames;
    private String logo;
}
