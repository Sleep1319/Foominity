package com.example.foominity.repository.board;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.category.ReviewCategory;

public interface ReviewCategoryRepository extends JpaRepository<ReviewCategory, Long> {

}
