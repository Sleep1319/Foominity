package com.example.foominity.repository.member;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.ReviewLike;
import com.example.foominity.domain.member.Member;

@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {
    Optional<ReviewLike> findByMemberAndReview(Member member, Review review);

    Optional<ReviewLike> findByMemberIdAndReviewId(Long memberId, Long reviewId);

    long countByReviewId(Long reviewId);

    List<ReviewLike> findByMemberId(Long memberId);
}
