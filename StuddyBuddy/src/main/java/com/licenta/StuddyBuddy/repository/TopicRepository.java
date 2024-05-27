package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends JpaRepository<Topic, String> {
}
