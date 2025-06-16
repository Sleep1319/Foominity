package com.example.foominity.service.board;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.category.Category;
import com.example.foominity.domain.category.ReviewCategory;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;
import com.example.foominity.dto.board.ReviewCreateRequest;
import com.example.foominity.dto.board.ReviewResponse;
import com.example.foominity.dto.board.ReviewUpdateRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.CategoryRepository;
import com.example.foominity.repository.board.ReviewCategoryRepository;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.PointRepository;

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

    // public Page<ReviewResponse> findAll(int page) {
    // PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC,
    // "id"));
    // Page<ReviewCategory> reviewCategorys =
    // reviewCategoryRepository.findAll(pageable);

    // List<ReviewResponse> reviewResponseList =
    // reviewCategorys.stream().map(reviewCategory -> new ReviewResponse(
    // reviewCategory.getReview().getId(),
    // reviewCategory.getReview().getTitle(),
    // reviewCategory.getReview().getContent(),
    // reviewCategory.getReview().getMember().getId(),
    // reviewCategory.getReview().getMember().getNickname(),
    // reviewCategory.getReview().getStarPoint(),
    // reviewCategory.getCategory().getCategoryName(),
    // reviewCategory.getCreatedDate(),
    // reviewCategory.getUpdatedDate())).toList();
    // return new PageImpl<>(reviewResponseList, pageable,
    // reviewCategorys.getTotalElements());
    // }

    // public ReviewResponse findById(Long id) {
    // ReviewCategory reviewCategory =
    // reviewCategoryRepository.findById(id).orElseThrow();
    // return new ReviewResponse(
    // reviewCategory.getReview().getId(),
    // reviewCategory.getReview().getTitle(),
    // reviewCategory.getReview().getContent(),
    // reviewCategory.getReview().getMember().getId(),
    // reviewCategory.getReview().getMember().getNickname(),
    // reviewCategory.getReview().getStarPoint(),
    // reviewCategory.getCategory().getCategoryName(),
    // reviewCategory.getCreatedDate(),
    // reviewCategory.getUpdatedDate());
    // }

    @Transactional
    public void createReview(ReviewCreateRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 리뷰카운트 증가
        Point point = pointRepository.findByMemberId(memberId).orElseThrow();
        point.increaseReviewCount();

        // 리뷰 따로 카테고리 따로 세이브 하고 싶다. 시도 중
        reviewRepository.save(req.toEntityReview(req, member));

        // List<Category> categories = categoryRepository
        // // categoryRepository.save(req.toEntity(req, member));

    }

    // @Transactional
    // public void updateReview(Long id, ReviewUpdateRequest req, HttpServletRequest
    // tokenRequest) {
    // ReviewCategory reviewCategory = validateReviewOwnership(id, tokenRequest);
    // Review review = reviewCategory.getReview();
    // review.update(req.getTitle(), req.getContent(), req.getStarPoint());

    // Category category = reviewCategory.getCategory();
    // category.update(req.getCategory());
    // }

    @Transactional
    public void deleteReview(Long id, HttpServletRequest tokenRequest) {
        ReviewCategory reviewCategory = validateReviewOwnership(id, tokenRequest);
        reviewCategoryRepository.delete(reviewCategory);
    }

    @Transactional
    public ReviewCategory validateReviewOwnership(Long id, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // Board와 Review를 따로 해야하나?
        // Board와 review의 차이점 => 카테고리 상속 유무, 추천 유무
        ReviewCategory reviewCategory = reviewCategoryRepository.findById(id).orElseThrow();

        if (!reviewCategory.getReview().getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }
        return reviewCategory;
    }

}
