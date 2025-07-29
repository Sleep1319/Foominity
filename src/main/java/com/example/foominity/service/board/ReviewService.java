package com.example.foominity.service.board;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.foominity.dto.board.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.artist.AlbumArtist;
import com.example.foominity.domain.artist.Artist;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.board.ReviewComment;
import com.example.foominity.domain.category.ArtistCategory;
import com.example.foominity.domain.category.Category;
import com.example.foominity.domain.category.ReviewCategory;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;
import com.example.foominity.domain.member.ReviewLike;
import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.artist.ArtistSimpleResponse;
import com.example.foominity.dto.category.ReviewCategoryResponse;
import com.example.foominity.dto.member.MemberReviewResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReviewException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.artist.AlbumArtistRepository;
import com.example.foominity.repository.artist.ArtistRepository;
import com.example.foominity.repository.board.ReviewCommentRepository;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.category.ArtistCategoryRepository;
import com.example.foominity.repository.category.CategoryRepository;
import com.example.foominity.repository.category.ReviewCategoryRepository;
import com.example.foominity.repository.image.ImageRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.PointRepository;
import com.example.foominity.repository.member.ReviewLikeRepository;
import com.example.foominity.service.image.ImageService;
import com.example.foominity.service.member.PointService;
import com.example.foominity.util.AuthUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

        private final ReviewRepository reviewRepository;
        private final CategoryRepository categoryRepository;
        private final ReviewCategoryRepository reviewCategoryRepository;
        private final MemberRepository memberRepository;
        private final JwtTokenProvider jwtTokenProvider;
        private final AlbumArtistRepository albumArtistRepository;
        private final ArtistRepository artistRepository;

        private final ImageService imageService;
        private final ReviewCommentService reviewCommentService;
        private final ReviewCommentRepository reviewCommentRepository;
        private final ReviewLikeRepository reviewLikeRepository;

        // 리뷰 전체 조회
        public Page<ReviewSimpleResponse> findAll(int page) {
                PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));
                Page<Review> reviews = reviewRepository.findAll(pageable);

                List<ReviewSimpleResponse> reviewSimpleResponsesList = reviews.stream()
                                .map(review -> {
                                        List<AlbumArtist> albumArtists = albumArtistRepository
                                                        .findByReviewId(review.getId());

                                        List<ArtistSimpleResponse> artistSimpleResponses = albumArtists.stream()
                                                        .map(a -> {
                                                                Artist artist = a.getArtist();
                                                                ImageFile artistImageFile = artist.getImageFile();
                                                                String artistImagePath = (artistImageFile != null)
                                                                                ? artistImageFile.getSavePath()
                                                                                : null;

                                                                return new ArtistSimpleResponse(
                                                                                artist.getId(),
                                                                                artist.getName(),
                                                                                artistImagePath);

                                                        }).toList();

                                        List<ReviewCategory> reviewCategory = reviewCategoryRepository
                                                        .findByReviewId(review.getId());
                                        List<ReviewCategoryResponse> categoryResponses = reviewCategory.stream()
                                                        .map(rc -> new ReviewCategoryResponse(
                                                                        rc.getCategory().getId(),
                                                                        rc.getCategory().getCategoryName()))
                                                        .toList();

                                        ImageFile imageFile = review.getImageFile();
                                        String imagePath = (imageFile != null) ? imageFile.getSavePath() : null;

                                        return new ReviewSimpleResponse(
                                                        review.getId(),
                                                        review.getTitle(),
                                                        reviewCommentService.getAverageStarPoint(review.getId()),
                                                        artistSimpleResponses,
                                                        categoryResponses,
                                                        imagePath);
                                })
                                .toList();

                return new PageImpl<>(reviewSimpleResponsesList, pageable, reviews.getTotalElements());

        }

        // 리뷰 개별 조회
        public ReviewResponse readReview(Long id) {
                Review review = reviewRepository.findById(id).orElseThrow(NotFoundReviewException::new);

                List<ReviewCategory> reviewCategory = reviewCategoryRepository.findByReviewId(review.getId());

                List<AlbumArtist> albumArtists = albumArtistRepository.findByReviewId(review.getId());

                List<ReviewCategoryResponse> categoryResponses = reviewCategory.stream()
                                .map(rc -> new ReviewCategoryResponse(
                                                rc.getCategory().getId(),
                                                rc.getCategory().getCategoryName()))
                                .toList();

                List<ArtistSimpleResponse> artistSimpleResponses = albumArtists.stream()
                                .map(a -> {
                                        Artist artist = a.getArtist();
                                        ImageFile artistImageFile = artist.getImageFile();
                                        String artistImagePath = (artistImageFile != null)
                                                        ? artistImageFile.getSavePath()
                                                        : null;

                                        return new ArtistSimpleResponse(
                                                        artist.getId(),
                                                        artist.getName(),
                                                        artistImagePath);

                                }).toList();

                ImageFile imageFile = review.getImageFile();
                String imagePath = (imageFile != null) ? imageFile.getSavePath() : null;

                return new ReviewResponse(
                                review.getId(),
                                review.getTitle(),
                                review.getReleased(),
                                review.getTracklist(),
                                artistSimpleResponses,
                                categoryResponses,
                                reviewCommentService.getAverageStarPoint(review.getId()),
                                imagePath);
        }

        // 특정 아티스트 리뷰 조회
        public List<ReviewSimpleResponse> getReviewsByArtist(Long id) {

                List<Review> reviews = reviewRepository.findReviewsByArtist(id);

                return reviews.stream()
                                .map(review -> {
                                        List<AlbumArtist> albumArtists = albumArtistRepository
                                                        .findByReviewId(review.getId());

                                        List<ArtistSimpleResponse> artistSimpleResponses = albumArtists.stream()
                                                        .map(a -> {
                                                                Artist artist = a.getArtist();
                                                                ImageFile artistImageFile = artist.getImageFile();
                                                                String artistImagePath = (artistImageFile != null)
                                                                                ? artistImageFile.getSavePath()
                                                                                : null;

                                                                return new ArtistSimpleResponse(
                                                                                artist.getId(),
                                                                                artist.getName(),
                                                                                artistImagePath);

                                                        }).toList();

                                        List<ReviewCategory> reviewCategory = reviewCategoryRepository
                                                        .findByReviewId(review.getId());
                                        List<ReviewCategoryResponse> categoryResponses = reviewCategory.stream()
                                                        .map(rc -> new ReviewCategoryResponse(
                                                                        rc.getCategory().getId(),
                                                                        rc.getCategory().getCategoryName()))
                                                        .toList();

                                        ImageFile imageFile = review.getImageFile();
                                        String imagePath = (imageFile != null) ? imageFile.getSavePath() : null;

                                        return new ReviewSimpleResponse(
                                                        review.getId(),
                                                        review.getTitle(),
                                                        reviewCommentService.getAverageStarPoint(review.getId()),
                                                        artistSimpleResponses,
                                                        categoryResponses,
                                                        imagePath);

                                })
                                .toList();

        }

        // 리뷰 생성
        @Transactional
        public void createReview(ReviewRequest req, HttpServletRequest tokenRequest) {
                String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

                if (!jwtTokenProvider.validateToken(token)) {
                        throw new UnauthorizedException();
                }

                Long memberId = jwtTokenProvider.getUserIdFromToken(token);
                Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

                AuthUtil.validateAdmin(member);

                // 이미지파일 생성 (image or imagePath 둘 다 지원!)
                ImageFile imageFile = null;
                if (req.getImage() != null && !req.getImage().isEmpty()) {
                        imageFile = imageService.imageUpload(req.getImage());
                } else if (req.getImagePath() != null && !req.getImagePath().isBlank()) {
                        imageFile = imageService.getImageByPath(req.getImagePath());
                } else {
                        throw new IllegalArgumentException("이미지 정보가 없습니다.");
                }

                // 리뷰변수
                Review review = new Review(
                                req.getTitle(),
                                req.getReleased(),
                                req.getTracklist(),
                                imageFile);

                // 리뷰저장
                review = reviewRepository.save(review);

                // 카테고리 저장
                List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
                for (Category category : categories) {
                        reviewCategoryRepository.save(new ReviewCategory(review, category));
                }

                // 아티스트 저장
                List<Artist> artists = artistRepository.findAllById(req.getArtistIds());
                for (Artist artist : artists) {
                        albumArtistRepository.save(new AlbumArtist(review, artist));
                }

        }

        // 리뷰 수정
        @Transactional
        public void updateReview(Long reviewId, ReviewUpdateRequest req, HttpServletRequest tokenRequest) {
                Member member = getAdminMember(tokenRequest);

                Review review = reviewRepository.findById(reviewId).orElseThrow(NotFoundReviewException::new);

                ImageFile imageFile = review.getImageFile();

                if (req.getImage() != null && !req.getImage().isEmpty()) {
                        imageFile = imageService.imageUpload(req.getImage());
                }

                review.update(req.getTitle(), req.getReleased(), req.getTracklist(), imageFile);

                reviewCategoryRepository.deleteByReviewId(reviewId);
                albumArtistRepository.deleteByReviewId(reviewId);

                List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
                for (Category category : categories) {
                        reviewCategoryRepository.save(new ReviewCategory(review, category));
                }

                List<Artist> artists = artistRepository.findAllById(req.getArtistIds());
                for (Artist artist : artists) {
                        albumArtistRepository.save(new AlbumArtist(review, artist));
                }

        }

        // 리뷰글 삭제
        @Transactional
        public void deleteReview(Long reviewId, HttpServletRequest tokenRequest) {
                Member member = getAdminMember(tokenRequest);

                Review review = reviewRepository.findById(reviewId).orElseThrow(NotFoundReviewException::new);

                ImageFile imageFile = review.getImageFile();

                imageService.deleteImageFile(imageFile);
                reviewCategoryRepository.deleteByReviewId(reviewId);
                albumArtistRepository.deleteByReviewId(reviewId);
                reviewRepository.delete(review);
        }

        // 관리자 검증 메서드
        private Member getAdminMember(HttpServletRequest request) {
                String token = jwtTokenProvider.resolveTokenFromCookie(request);
                if (!jwtTokenProvider.validateToken(token)) {
                        throw new UnauthorizedException();
                }

                Long memberId = jwtTokenProvider.getUserIdFromToken(token);
                Member member = memberRepository.findById(memberId)
                                .orElseThrow(NotFoundMemberException::new);

                AuthUtil.validateAdmin(member);
                return member;
        }

        public List<ReviewLatestResponse> getLatest() {
                List<Review> reviewList = reviewRepository.findTop4ByOrderByCreatedDateDesc()
                                .orElseThrow(NotFoundReviewException::new);

                return reviewList.stream()
                                .map(review -> new ReviewLatestResponse(
                                                review.getId(),
                                                review.getTitle()))
                                .toList();
        }

        public List<MemberReviewResponse> getParticipatedReviews(Long memberId) {
                List<ReviewComment> comments = reviewCommentRepository.findByMemberId(memberId);

                return comments.stream().map(rc -> {
                        Review review = rc.getReview();

                        // 아티스트
                        var artistResp = albumArtistRepository
                                        .findByReviewId(review.getId())
                                        .stream()
                                        .map(a -> new ArtistSimpleResponse(a.getArtist().getId(),
                                                        a.getArtist().getName()))
                                        .toList();

                        // 카테고리
                        var catResp = reviewCategoryRepository
                                        .findByReviewId(review.getId())
                                        .stream()
                                        .map(c -> new ReviewCategoryResponse(
                                                        c.getCategory().getId(),
                                                        c.getCategory().getCategoryName()))
                                        .toList();

                        // 이미지 경로
                        String path = review.getImageFile() != null
                                        ? review.getImageFile().getSavePath()
                                        : null;

                        // 평균별점
                        Float rawAvg = reviewCommentRepository.findAverageStarPoint(review.getId());
                        float avg = rawAvg == null ? 0f : Math.round(rawAvg * 100) / 100.0f;

                        // 내가 준 별점
                        float userStar = rc.getStarPoint();

                        return new MemberReviewResponse(
                                        review.getId(),
                                        review.getTitle(),
                                        path,
                                        avg,
                                        userStar,
                                        artistResp,
                                        catResp);
                }).toList();
        }

        public List<MemberReviewResponse> getLikedReviews(Long memberId) {
                // 1. 내가 좋아요 누른 리뷰(앨범) 가져오기
                List<ReviewLike> likes = reviewLikeRepository.findByMemberId(memberId);

                return likes.stream().map(rl -> {
                        Review review = rl.getReview();

                        // 아티스트 목록
                        var artistResp = albumArtistRepository.findByReviewId(review.getId())
                                        .stream()
                                        .map(a -> new ArtistSimpleResponse(a.getArtist().getId(),
                                                        a.getArtist().getName()))
                                        .toList();

                        // 카테고리 목록
                        var catResp = reviewCategoryRepository.findByReviewId(review.getId())
                                        .stream()
                                        .map(c -> new ReviewCategoryResponse(
                                                        c.getCategory().getId(),
                                                        c.getCategory().getCategoryName()))
                                        .toList();

                        // 앨범 이미지 경로
                        String path = review.getImageFile() != null
                                        ? review.getImageFile().getSavePath()
                                        : null;

                        // 평균별점
                        Float rawAvg = reviewCommentRepository.findAverageStarPoint(review.getId());
                        float avg = rawAvg == null ? 0f : Math.round(rawAvg * 100) / 100.0f;

                        // 내가 준 별점은 좋아요랑 무관하니 빼버림!
                        return new MemberReviewResponse(
                                        review.getId(),
                                        review.getTitle(),
                                        path,
                                        avg,
                                        /* userStar = */ 0f, // 좋아요만 한 앨범은 별점 없이 0f
                                        artistResp,
                                        catResp);
                }).toList();
        }

        public List<ReviewSimpleResponse> getTopRankedReviews() {
                // 0페이지, 사이즈 10
                var page10 = PageRequest.of(0, 10);
                // 리뷰ID + 평균별점 투영
                List<ReviewCommentRepository.TopReviewProjection> top = reviewCommentRepository
                                .findTopReviewsByAverage(page10);

                return top.stream().map(p -> {
                        // 엔티티 로딩
                        Review review = reviewRepository.findById(p.getReviewId())
                                        .orElseThrow();

                        // 아티스트 목록 DTO
                        var artistDtos = albumArtistRepository
                                        .findByReviewId(review.getId())
                                        .stream()
                                        .map(a -> new ArtistSimpleResponse(a.getArtist().getId(),
                                                        a.getArtist().getName()))
                                        .toList();

                        // 카테고리 목록 DTO
                        var categoryDtos = reviewCategoryRepository
                                        .findByReviewId(review.getId())
                                        .stream()
                                        .map(rc -> new ReviewCategoryResponse(
                                                        rc.getCategory().getId(), rc.getCategory().getCategoryName()))
                                        .toList();

                        // 이미지 경로
                        ImageFile img = review.getImageFile();
                        String imagePath = img != null ? img.getSavePath() : null;

                        // 평균별점 (투영에서 바로 꺼내되 소수점 둘째 자리 반올림)
                        float avg = (float) Math.round(p.getAvg() * 100) / 100.0f;

                        return new ReviewSimpleResponse(
                                        review.getId(),
                                        review.getTitle(),
                                        avg,
                                        artistDtos,
                                        categoryDtos,
                                        imagePath);
                }).toList();
        }

}
