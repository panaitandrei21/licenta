package com.licenta.StuddyBuddy.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Blob;
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
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] logo;

    @OneToMany(mappedBy = "course")
    @JsonManagedReference("course-module")
    private List<Module> modules;
}
