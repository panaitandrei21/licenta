package com.licenta.StuddyBuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String assignmentId;

    private String title;
    private Instant createdDate;
    private String category;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] content;
    private LocalDateTime dueDate;

    @ManyToOne
    @JsonBackReference
    private Module module;

    @ManyToOne
    @JsonBackReference
    private User createdby;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<AssignmentSubmission> submissions;
}
