package com.example.foominity.repository.board;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.board.ReviewComment;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

    List<ReviewComment> findByReviewId(Long id);

    Optional<ReviewComment> findByReviewIdAndMemberId(Long reviewId, Long memberId);

    @Query("SELECT AVG(rc.starPoint) FROM ReviewComment rc WHERE rc.review.id = :reviewId")
    Float findAverageStarPoint(@Param("reviewId") Long reviewId);
}