package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.dto.SearchSubmissionsDTO;
import com.licenta.StuddyBuddy.model.AssignmentSubmission;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class CustomAssignmentSubmissionRepositoryImpl implements CustomAssignmentSubmissionRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<AssignmentSubmission> findSubmissionsByCriteria(SearchSubmissionsDTO dto, Long page, Long pageSize) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<AssignmentSubmission> query = cb.createQuery(AssignmentSubmission.class);
        Root<AssignmentSubmission> submission = query.from(AssignmentSubmission.class);

        List<Predicate> predicates = new ArrayList<>();

        if (dto.getAssignmentInstanceId() != null && !dto.getAssignmentInstanceId().isEmpty()) {
            predicates.add(cb.equal(submission.get("assignmentInstance").get("assignmentInstanceId"), dto.getAssignmentInstanceId()));
        }
        if (dto.getStudentFirstName() != null && !dto.getStudentFirstName().isEmpty()) {
            predicates.add(cb.like(cb.lower(submission.get("user").get("firstName")), "%" + dto.getStudentFirstName().toLowerCase() + "%"));
        }
        if (dto.getStudentLastName() != null && !dto.getStudentLastName().isEmpty()) {
            predicates.add(cb.like(cb.lower(submission.get("user").get("firstName")), "%" + dto.getStudentLastName().toLowerCase() + "%"));
        }
        if (dto.getAssignmentName() != null && !dto.getAssignmentName().isEmpty()) {
            predicates.add(cb.like(cb.lower(submission.get("user").get("firstName")), "%" + dto.getAssignmentName().toLowerCase() + "%"));
        }
        if (dto.getSubmissionDate() != null) {
            predicates.add(cb.equal(cb.function("date", Date.class, submission.get("submissionDate")), dto.getSubmissionDate()));
        }

        // If no predicates are added, this means the DTO is empty and we should return all submissions
        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        int pageSizeValue = (pageSize != null) ? pageSize.intValue() : 20;
        int pageNumber = (page != null) ? page.intValue() : 0;
        int offset = pageNumber * pageSizeValue;

        return entityManager.createQuery(query)
                .setFirstResult(offset)
                .setMaxResults(pageSizeValue)
                .getResultList();
    }

    @Override
    public long countSubmissionsByCriteria(SearchSubmissionsDTO dto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<AssignmentSubmission> submission = query.from(AssignmentSubmission.class);

        List<Predicate> predicates = new ArrayList<>();

        if (dto.getAssignmentInstanceId() != null && !dto.getAssignmentInstanceId().isEmpty()) {
            predicates.add(cb.equal(submission.get("assignmentInstance").get("assignmentInstanceId"), dto.getAssignmentInstanceId()));
        }
        if (dto.getStudentFirstName() != null && !dto.getStudentFirstName().isEmpty()) {
            predicates.add(cb.like(cb.lower(submission.get("user").get("firstName")), "%" + dto.getStudentFirstName().toLowerCase() + "%"));
        }
        if (dto.getStudentLastName() != null && !dto.getStudentLastName().isEmpty()) {
            predicates.add(cb.like(cb.lower(submission.get("user").get("firstName")), "%" + dto.getStudentLastName().toLowerCase() + "%"));
        }
        if (dto.getAssignmentName() != null && !dto.getAssignmentName().isEmpty()) {
            predicates.add(cb.like(cb.lower(submission.get("user").get("firstName")), "%" + dto.getAssignmentName().toLowerCase() + "%"));
        }

        query.select(cb.count(submission)).where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(query).getSingleResult();
    }
}
