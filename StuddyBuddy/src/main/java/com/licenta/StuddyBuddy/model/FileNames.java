package com.licenta.StuddyBuddy.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class FileNames {
    private String file;
    @Id
    private Long id;


}
