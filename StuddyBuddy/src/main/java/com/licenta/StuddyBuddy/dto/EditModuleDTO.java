package com.licenta.StuddyBuddy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditModuleDTO {
    private String moduleId;
    private String title;
    private String description;

}
