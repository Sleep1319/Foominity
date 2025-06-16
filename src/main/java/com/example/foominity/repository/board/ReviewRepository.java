package com.example.foominity.repository.board;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findAll(Pageable Pageable);

    Optional<Review> findById(Long id);
}
