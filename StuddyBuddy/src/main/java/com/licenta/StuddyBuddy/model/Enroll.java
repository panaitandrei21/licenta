package com.licenta.StuddyBuddy.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class Enroll {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String enrollmentId;

    @ManyToOne
    private User user;

    @ManyToOne
    private Course course;

}
