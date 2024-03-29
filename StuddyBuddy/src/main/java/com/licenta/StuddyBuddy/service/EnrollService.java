package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.model.Enroll;
import com.licenta.StuddyBuddy.model.User;
import com.licenta.StuddyBuddy.repository.EnrollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnrollService {
    private final EnrollRepository enrollRepository;

    public Enroll enrollUser(String userId, String courseId) {
        Enroll enroll = Enroll.builder()
                .userId(userId)
                .courseId(courseId)
                .build();
       return enrollRepository.save(enroll);
    }
}
