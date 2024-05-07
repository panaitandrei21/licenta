package com.licenta.StuddyBuddy.dto;

import com.licenta.StuddyBuddy.model.FileDescriptions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditModuleDTO {
    private String moduleId;
    private String title;
    private String description;

}
