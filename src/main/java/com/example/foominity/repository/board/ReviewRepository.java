package com.example.foominity.repository.board;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<List<Review>> findTop4ByOrderByCreatedDateDesc();
}
