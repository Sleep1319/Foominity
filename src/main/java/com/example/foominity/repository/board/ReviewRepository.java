package com.example.foominity.repository.board;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
