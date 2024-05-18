package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.Assignment;
import com.licenta.StuddyBuddy.dto.SearchAssignmentsDTO;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CustomAssignmentRepositoryImpl implements CustomAssignmentRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Assignment> findAssignmentsByCriteria(SearchAssignmentsDTO dto, Long page, Long pageSize) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Assignment> query = cb.createQuery(Assignment.class);
        Root<Assignment> assignment = query.from(Assignment.class);

        List<Predicate> predicates = new ArrayList<>();

        if (dto.getAssignmentId() != null && !dto.getAssignmentId().equals("")) {
            predicates.add(cb.equal(assignment.get("assignmentId"), dto.getAssignmentId()));
        }
        if (dto.getCategory() != null && !dto.getCategory().equals("")) {
            predicates.add(cb.equal(assignment.get("category"), dto.getCategory()));
        }
        if (dto.getTitle() != null && !dto.getTitle().equals("")) {
            predicates.add(cb.equal(assignment.get("title"), dto.getTitle()));
        }
        if (dto.getCreatedBy() != null && !dto.getCreatedBy().equals("")) {
            predicates.add(cb.equal(assignment.get("createdBy"), dto.getCreatedBy()));
        }
        if (dto.getCreatedDate() != null && !dto.getCreatedDate().equals("")) {
            predicates.add(cb.equal(assignment.get("createdDate"), dto.getCreatedDate()));
        }

        // Apply predicates if there are any
        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        // Apply pagination
        int pageSizeValue = (pageSize != null) ? pageSize.intValue() : 100;
        int pageNumber = (page != null) ? page.intValue() : 0;
        int offset = pageNumber * pageSizeValue;

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

        if (dto.getAssignmentId() != null && !dto.getAssignmentId().equals("")) {
            predicates.add(cb.equal(assignment.get("assignmentId"), dto.getAssignmentId()));
        }
        if (dto.getCategory() != null && !dto.getCategory().equals("")) {
            predicates.add(cb.equal(assignment.get("category"), dto.getCategory()));
        }
        if (dto.getTitle() != null && !dto.getTitle().equals("")) {
            predicates.add(cb.equal(assignment.get("title"), dto.getTitle()));
        }
        if (dto.getCreatedBy() != null && !dto.getCreatedBy().equals("")) {
            predicates.add(cb.equal(assignment.get("createdBy"), dto.getCreatedBy()));
        }
        if (dto.getCreatedDate() != null && !dto.getCreatedDate().equals("")) {
            predicates.add(cb.equal(assignment.get("createdDate"), dto.getCreatedDate()));
        }

        query.select(cb.count(assignment)).where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(query).getSingleResult();
    }
}
