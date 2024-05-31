package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.dto.SearchAssignmentsDTO;
import com.licenta.StuddyBuddy.model.Assignment;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class CustomAssignmentRepositoryImpl implements CustomAssignmentRepository {

    @PersistenceContext
    private EntityManager entityManager;

    private static final Logger logger = LoggerFactory.getLogger(CustomAssignmentRepositoryImpl.class);

    @Override
    public List<Assignment> findAssignmentsByCriteria(SearchAssignmentsDTO dto, Long page, Long pageSize) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Assignment> query = cb.createQuery(Assignment.class);
        Root<Assignment> assignment = query.from(Assignment.class);

        List<Predicate> predicates = new ArrayList<>();

        if (dto.getAssignmentId() != null && !dto.getAssignmentId().isEmpty()) {
            predicates.add(cb.equal(assignment.get("assignmentId"), dto.getAssignmentId()));
        }
        if (dto.getCategory() != null && !dto.getCategory().isEmpty()) {
            predicates.add(cb.equal(assignment.get("category"), dto.getCategory()));
        }
        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) {
            predicates.add(cb.like(cb.lower(assignment.get("title")), "%" + dto.getTitle().toLowerCase() + "%"));
        }
        if (dto.getCreatedBy() != null && !dto.getCreatedBy().isEmpty()) {
            predicates.add(cb.equal(assignment.get("createdBy"), dto.getCreatedBy()));
        }
        if (dto.getCreatedDate() != null) {
            // Convert Date to LocalDate
            LocalDate createdDateLocal = dto.getCreatedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            predicates.add(cb.equal(cb.function("date", LocalDate.class, assignment.get("createdDate")), createdDateLocal));
        }

        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        // Apply pagination
        int pageSizeValue = (pageSize != null) ? pageSize.intValue() : 20;
        int pageNumber = (page != null) ? page.intValue() : 0;
        int offset = pageNumber * pageSizeValue;

        // Log the query
        logger.debug("Generated query: " + query.toString());

        return entityManager.createQuery(query)
                .setFirstResult(offset)
                .setMaxResults(pageSizeValue)
                .getResultList();
    }

    @Override
    public long countAssignmentsByCriteria(SearchAssignmentsDTO dto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Assignment> assignment = query.from(Assignment.class);

        List<Predicate> predicates = new ArrayList<>();

        if (dto.getAssignmentId() != null && !dto.getAssignmentId().isEmpty()) {
            predicates.add(cb.equal(assignment.get("assignmentId"), dto.getAssignmentId()));
        }
        if (dto.getCategory() != null && !dto.getCategory().isEmpty()) {
            predicates.add(cb.equal(assignment.get("category"), dto.getCategory()));
        }
        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) {
            // Case insensitive comparison
            predicates.add(cb.like(cb.lower(assignment.get("title")), "%" + dto.getTitle().toLowerCase() + "%"));
        }
        if (dto.getCreatedBy() != null && !dto.getCreatedBy().isEmpty()) {
            predicates.add(cb.equal(assignment.get("createdBy"), dto.getCreatedBy()));
        }
        if (dto.getCreatedDate() != null) {
            // Convert Date to LocalDate
            LocalDate createdDateLocal = dto.getCreatedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            predicates.add(cb.equal(cb.function("date", LocalDate.class, assignment.get("createdDate")), createdDateLocal));
        }

        query.select(cb.count(assignment)).where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(query).getSingleResult();
    }
}
