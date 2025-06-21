package com.example.foominity.repository.category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.category.ReviewCategory;

public interface ReviewCategoryRepository extends JpaRepository<ReviewCategory, Long> {
    List<ReviewCategory> findByReviewId(Long reviewId);

    void deleteByReviewId(Long reviewid);
}
