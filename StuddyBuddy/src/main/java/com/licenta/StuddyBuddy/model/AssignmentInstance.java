package com.licenta.StuddyBuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentInstance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String assignmentInstanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    @JsonBackReference("assignment-assignmentInstance")
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    @JsonBackReference("module-assignmentInstance")
    private Module module;

    private Date dueDate;

    @OneToMany(mappedBy = "assignmentInstance", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference("assignmentInstance-submission")
    private List<AssignmentSubmission> submissions;
}
