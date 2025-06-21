package com.example.foominity.service.board;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.category.Category;
import com.example.foominity.domain.category.ReviewCategory;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;
import com.example.foominity.dto.board.BoardUpdateRequest;
import com.example.foominity.dto.board.ReviewRequest;
import com.example.foominity.dto.board.ReviewResponse;
import com.example.foominity.dto.board.ReviewUpdateRequest;
import com.example.foominity.dto.category.ReviewCategoryResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReviewException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.category.CategoryRepository;
import com.example.foominity.repository.category.ReviewCategoryRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.PointRepository;
import com.example.foominity.service.member.PointService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewCategoryRepository reviewCategoryRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PointRepository pointRepository;

    private final PointService pointService;

    public Page<ReviewResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));
        Page<Review> reviews = reviewRepository.findAll(pageable);

        List<ReviewResponse> reviewResponsesList = reviews.stream()
                .map(review -> {
                    List<ReviewCategory> reviewCategories = reviewCategoryRepository.findByReviewId(review.getId());

                    List<ReviewCategoryResponse> categoryResponses = reviewCategories.stream()
                            .map(rc -> new ReviewCategoryResponse(
                                    rc.getCategory().getId(),
                                    rc.getCategory().getCategoryName()))
                            .toList();

                    return new ReviewResponse(
                            review.getId(),
                            review.getTitle(),
                            review.getContent(),
                            review.getMember().getId(),
                            review.getMember().getNickname(),
                            review.getStarPoint(),
                            categoryResponses,
                            review.getCreatedDate(),
                            review.getUpdatedDate());

                })
                .toList();

        return new PageImpl<>(reviewResponsesList, pageable, reviews.getTotalElements());

    }

    public ReviewResponse readReview(Long id) {
        Review review = reviewRepository.findById(id).orElseThrow(NotFoundReviewException::new);

        List<ReviewCategory> reviewCategory = reviewCategoryRepository.findByReviewId(review.getId());

        List<ReviewCategoryResponse> categoryResponses = reviewCategory.stream()
                .map(rc -> new ReviewCategoryResponse(
                        rc.getCategory().getId(),
                        rc.getCategory().getCategoryName()))
                .toList();

        return new ReviewResponse(
                review.getId(),
                review.getTitle(),
                review.getContent(),
                review.getMember().getId(),
                review.getMember().getNickname(),
                review.getStarPoint(),
                categoryResponses,
                review.getCreatedDate(),
                review.getUpdatedDate());
    }

    @Transactional
    public void createReview(ReviewRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 리뷰카운트 증가
        pointService.updateReviewCount(memberId);

        // 리뷰변수
        Review review = new Review(
                req.getTitle(),
                req.getContent(),
                member,
                req.getStarPoint());

        // 리뷰저장
        review = reviewRepository.save(review);

        // 카테고리 저장
        List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
        for (Category category : categories) {
            reviewCategoryRepository.save(new ReviewCategory(review, category));
        }

    }

    @Transactional
    public void updateReview(Long reviewId, ReviewUpdateRequest req, HttpServletRequest tokenRequest) {
        Review review = validateReviewOwnership(reviewId, tokenRequest);
        review.update(req.getTitle(), req.getContent(), req.getStarPoint());

        // 기존 연결된 카테고리 삭제
        reviewCategoryRepository.deleteByReviewId(reviewId);

        // 새로 받은 카테고리 ID로 연결 다시 생성
        List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
        for (Category category : categories) {
            reviewCategoryRepository.save(new ReviewCategory(review, category));
        }
    }

    // 리뷰글 삭제
    @Transactional
    public void deleteReview(Long reviewId, HttpServletRequest tokenRequest) {
        Review review = validateReviewOwnership(reviewId, tokenRequest);

        reviewCategoryRepository.deleteByReviewId(reviewId);

        reviewRepository.delete(review);
    }

    // 리뷰 작성자 검증 메서드
    public Review validateReviewOwnership(Long reviewId, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Review review = reviewRepository.findById(reviewId).orElseThrow(NotFoundReviewException::new);

        if (!review.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }

        return review;
    }

    public List<ReviewResponse> getLatest() {
        List<Review> reviewList = reviewRepository.findTop4ByOrderByCreatedDateDesc().orElseThrow(NotFoundReviewException::new);

        return reviewList.stream()
                .map(review -> new ReviewResponse(
                        review.getId(),
                        review.getTitle(),
                        review.getMember().getNickname(),
                        review.getCreatedDate(),
                        review.getUpdatedDate()
                )).toList();
    }

    public List<ReviewResponse> getTop3LikeReviews(int top3) {
        Pageable pageable = PageRequest.of(0, top3);
        List<Review> reviewList = reviewRepository.getTop3LikeReviews(pageable).orElseThrow(NotFoundReviewException::new);

        return reviewList.stream()
                .map(review -> new ReviewResponse(
                        review.getId(),
                        review.getTitle(),
                        review.getMember().getNickname(),
                        review.getCreatedDate(),
                        review.getUpdatedDate()
                )).toList();
    }
}
