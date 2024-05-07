package com.licenta.StuddyBuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class FileDescriptions {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String fileDescriptionsId;

    private String filePath;
    @ManyToOne
    @JsonBackReference
    private Module module;
    @Transient
    public String getCleanFilePath() {
        int underscoreIndex = this.filePath.indexOf('_');
        return underscoreIndex > -1 ? this.filePath.substring(underscoreIndex + 1) : this.filePath;
    }
}
