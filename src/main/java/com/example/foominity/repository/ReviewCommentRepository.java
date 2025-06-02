package com.example.foominity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.ReviewComment;

public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

}