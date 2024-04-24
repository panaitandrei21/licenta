package com.licenta.StuddyBuddy.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleRequest {
    private String courseId;
    private String moduleId;

    private String title;
    private String description;
    private String filePath;

}
