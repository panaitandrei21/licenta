package com.licenta.StuddyBuddy.exception;

import lombok.*;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AssignmentNotFoundException extends RuntimeException {
    private HttpStatus status;

    public AssignmentNotFoundException(String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
    }
}
