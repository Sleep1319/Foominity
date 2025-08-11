package com.example.foominity.repository.board;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.board.ReviewComment;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

    // 특정 리뷰의 모든 댓글
    List<ReviewComment> findByReviewId(Long id);

    // 특정 리뷰에 대해 특정 사용자가 단 댓글 (내가 단 코멘트 중복 체크용)
    Optional<ReviewComment> findByReviewIdAndMemberId(Long reviewId, Long memberId);

    // 특정 리뷰의 평균 별점
    @Query("SELECT AVG(rc.starPoint) FROM ReviewComment rc WHERE rc.review.id = :reviewId")
    Float findAverageStarPoint(Long reviewId);

    // 특정 사용자가 단 모든 코멘트
    List<ReviewComment> findByMemberId(Long memberId);

    /**
     * Top N 리뷰를 평균 별점 내림차순으로 조회하기 위한 투영 인터페이스
     */
    interface TopReviewProjection {
        Long getReviewId();

        Double getAvg();
    }

    /**
     * 리뷰별 평균 별점을 계산해서 내림차순 정렬한 후,
     * Pageable 파라미터(예: PageRequest.of(0,10)) 만큼 잘라서 반환
     */
    @Query("""
              SELECT rc.review.id   AS reviewId,
                     AVG(rc.starPoint) AS avg
                FROM ReviewComment rc
            GROUP BY rc.review.id
            ORDER BY avg DESC
            """)
    List<TopReviewProjection> findTopReviewsByAverage(Pageable pageable);

    // @Query("SELECT AVG(rc.star_point) FROM review_comment rc WHERE rc.member_id =
    // :memberId")
    // Double findAverageRatingByMemberId(@Param("memberId") Long memberId);
    // 내가 준 별점들 평균
    @Query("""
            SELECT COALESCE(AVG(c.starPoint), 0)
              FROM ReviewComment c
             WHERE c.memberId = :memberId
            """)
    double findAverageRatingByMemberId(@Param("memberId") Long memberId);

    // 내가 평가한 앨범 수 조회
    long countByMemberId(Long memberId);
    // @Query("SELECT COUNT(rc.id) from review_comment rc where rc.member_id
    // =:memberId")
    // Long countByMemberId(@Param("memberId") Long memberId);
}
