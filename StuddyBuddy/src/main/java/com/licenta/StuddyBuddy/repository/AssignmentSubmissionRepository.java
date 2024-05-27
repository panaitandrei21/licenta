package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.AssignmentInstance;
import com.licenta.StuddyBuddy.model.AssignmentSubmission;
import com.licenta.StuddyBuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, String> {
    Optional<AssignmentSubmission> findByAssignmentInstanceAndUser(AssignmentInstance assignmentInstance, User user);
    @Query("SELECT asub FROM AssignmentSubmission asub JOIN asub.assignmentInstance ainst JOIN asub.user usr WHERE ainst.assignmentInstanceId = :assignmentInstanceId AND usr.userId = :userId")
    AssignmentSubmission findSubmissionsByInstanceIdAndUsername(@Param("assignmentInstanceId") String assignmentInstanceId, @Param("userId") String userId);

    List<AssignmentSubmission> findByAssignmentInstance_AssignmentInstanceId(String assignmentInstanceId);

}
