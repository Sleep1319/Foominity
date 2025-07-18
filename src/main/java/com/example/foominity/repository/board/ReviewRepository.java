package com.example.foominity.repository.board;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Review;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<List<Review>> findTop4ByOrderByCreatedDateDesc();

    // @Query(" select r from Review r left join Like l on r.id = l.review.id group
    // by r.id order by COUNT(l) desc ")
    // Optional<List<Review>> getTop3LikeReviews(Pageable pageable);

    @Query("""
            SELECT DISTINCT rc.review
              FROM ReviewComment rc
             WHERE rc.member.id = :memberId
             """)
    List<Review> findParticipatedReviews(Long memberId);
}
