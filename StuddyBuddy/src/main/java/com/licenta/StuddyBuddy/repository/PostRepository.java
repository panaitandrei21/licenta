package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
}
