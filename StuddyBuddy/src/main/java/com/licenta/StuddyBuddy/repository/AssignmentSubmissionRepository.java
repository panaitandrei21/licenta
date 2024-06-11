package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.dto.AssignmentReviewDTO;
import com.licenta.StuddyBuddy.dto.SearchSubmissionsDTO;
import com.licenta.StuddyBuddy.model.AssignmentInstance;
import com.licenta.StuddyBuddy.model.AssignmentSubmission;
import com.licenta.StuddyBuddy.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, String>, CustomAssignmentSubmissionRepository {
    Optional<AssignmentSubmission> findByAssignmentInstanceAndUser(AssignmentInstance assignmentInstance, User user);
    @Query("SELECT asub FROM AssignmentSubmission asub JOIN asub.assignmentInstance ainst JOIN asub.user usr WHERE ainst.assignmentInstanceId = :assignmentInstanceId AND usr.userId = :userId")
    AssignmentSubmission findSubmissionsByInstanceIdAndUsername(@Param("assignmentInstanceId") String assignmentInstanceId, @Param("userId") String userId);

    List<AssignmentSubmission> findByAssignmentInstance_AssignmentInstanceId(String assignmentInstanceId);

    List<AssignmentSubmission> findSubmissionsByCriteria(SearchSubmissionsDTO dto, Long page, Long pageSize);
    @Query("SELECT new com.licenta.StuddyBuddy.dto.AssignmentReviewDTO(" +
            "asub.feedback, asub.grade, new com.licenta.StuddyBuddy.dto.UserDTO(usr.userId, usr.firstName, usr.lastName, usr.email, usr.role), " +
            "new com.licenta.StuddyBuddy.dto.CourseDTO(c.courseId, c.courseName, c.description, c.category)) " +
            "FROM AssignmentSubmission asub " +
            "JOIN asub.assignmentInstance ainst " +
            "JOIN ainst.module m " +
            "JOIN m.course c " +
            "JOIN asub.user usr " +
            "WHERE (:courseName IS NULL OR c.courseName LIKE %:courseName%)")
    Page<AssignmentReviewDTO> findByCourseNameContaining(@Param("courseName") String courseName, Pageable pageable);


    @Query("SELECT new com.licenta.StuddyBuddy.dto.AssignmentReviewDTO(" +
            "asub.feedback, asub.grade, new com.licenta.StuddyBuddy.dto.UserDTO(usr.userId, usr.firstName, usr.lastName, usr.email, usr.role), " +
            "new com.licenta.StuddyBuddy.dto.CourseDTO(c.courseId, c.courseName, c.description, c.category)) " +
            "FROM AssignmentSubmission asub " +
            "JOIN asub.assignmentInstance ainst " +
            "JOIN ainst.module m " +
            "JOIN m.course c " +
            "JOIN asub.user usr " +
            "WHERE usr.userId = :userId")
    List<AssignmentReviewDTO> findByUser_UserId(@Param("userId") String userId);
    long countSubmissionsByCriteria(SearchSubmissionsDTO dto);

}
