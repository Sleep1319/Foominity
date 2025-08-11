package com.example.foominity.repository.member;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.ReviewLike;

@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

    Optional<ReviewLike> findByMemberAndReviewId(Member member, Long reviewId);


    Optional<ReviewLike> findByMemberAndReview(Member member, Review review);


    Optional<ReviewLike> findByMemberIdAndReviewId(Long memberId, Long reviewId);

    long countByReviewId(Long reviewId);

    List<ReviewLike> findByMemberId(Long memberId);

    @Query("""
              SELECT rc.category.categoryName AS genre,
                     COUNT(rc)                  AS cnt
                FROM ReviewCategory rc, ReviewLike rl
               WHERE rl.member.id = :memberId
                 AND rc.review.id   = rl.reviewId
               GROUP BY rc.category.categoryName
               ORDER BY cnt DESC
            """)
    List<GenreCount> countGenresByMember(@Param("memberId") Long memberId);

    interface GenreCount {
        String getGenre();

        Long getCnt();
    }
}
