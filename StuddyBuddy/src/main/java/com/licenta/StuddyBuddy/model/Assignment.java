package com.licenta.StuddyBuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
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

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] solution;

    @ManyToOne
    @JsonBackReference("user-assignment")
    private User createdby;

    @OneToMany(mappedBy = "assignment", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("assignment-assignmentInstance")
    private List<AssignmentInstance> assignmentInstances;
}
