package com.licenta.StuddyBuddy.exception;

import org.springframework.http.HttpStatus;

public class ModuleNotFoundException  extends RuntimeException {
    private HttpStatus status;

    public ModuleNotFoundException(String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
    }
}
