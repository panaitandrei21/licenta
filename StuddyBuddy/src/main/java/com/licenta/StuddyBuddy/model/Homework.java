package com.licenta.StuddyBuddy.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class Homework {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String homeworkId;

}
