package com.example.foominity.service.board;

import java.util.List;
import java.util.Optional;

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
import com.example.foominity.domain.category.ArtistCategory;
import com.example.foominity.domain.category.Category;
import com.example.foominity.domain.category.ReviewCategory;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;
import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.board.BoardUpdateRequest;
import com.example.foominity.dto.board.ReviewRequest;
import com.example.foominity.dto.board.ReviewResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.board.ReviewUpdateRequest;
import com.example.foominity.dto.category.ReviewCategoryResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReviewException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.artist.AlbumArtistRepository;
import com.example.foominity.repository.artist.ArtistRepository;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.category.ArtistCategoryRepository;
import com.example.foominity.repository.category.CategoryRepository;
import com.example.foominity.repository.category.ReviewCategoryRepository;
import com.example.foominity.repository.image.ImageRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.PointRepository;
import com.example.foominity.service.image.ImageService;
import com.example.foominity.service.member.PointService;
import com.example.foominity.util.AuthUtil;

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
        private final AlbumArtistRepository albumArtistRepository;
        private final ArtistRepository artistRepository;
        private final ImageRepository imageRepository;

        private final ImageService imageService;
        private final PointService pointService;
        private final ReviewCommentService reviewCommentService;

        public Page<ReviewSimpleResponse> findAll(int page) {
                PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));
                Page<Review> reviews = reviewRepository.findAll(pageable);

                List<ReviewSimpleResponse> reviewSimpleResponsesList = reviews.stream()
                                .map(review -> {
                                        List<AlbumArtist> albumArtists = albumArtistRepository
                                                        .findByReviewId(review.getId());

                                        List<ArtistResponse> artistResponses = albumArtists.stream().map(
                                                        a -> new ArtistResponse(
                                                                        a.getArtist().getId(),
                                                                        a.getArtist().getName()))
                                                        .toList();

                                        ImageFile imageFile = review.getImageFile();
                                        String imagePath = (imageFile != null) ? imageFile.getSavePath() : null;

                                        return new ReviewSimpleResponse(
                                                        review.getId(),
                                                        review.getTitle(),
                                                        reviewCommentService.getAverageStarPoint(review.getId()),
                                                        artistResponses,
                                                        imagePath);
                                })
                                .toList();

                return new PageImpl<>(reviewSimpleResponsesList, pageable, reviews.getTotalElements());

        }

        public ReviewResponse readReview(Long id) {
                Review review = reviewRepository.findById(id).orElseThrow(NotFoundReviewException::new);

                List<ReviewCategory> reviewCategory = reviewCategoryRepository.findByReviewId(review.getId());

                List<AlbumArtist> albumArtists = albumArtistRepository.findByReviewId(review.getId());

                List<ReviewCategoryResponse> categoryResponses = reviewCategory.stream()
                                .map(rc -> new ReviewCategoryResponse(
                                                rc.getCategory().getId(),
                                                rc.getCategory().getCategoryName()))
                                .toList();

                List<ArtistResponse> artistResponses = albumArtists.stream().map(
                                a -> new ArtistResponse(
                                                a.getArtist().getId(),
                                                a.getArtist().getName()))
                                .toList();

                ImageFile imageFile = review.getImageFile();
                String imagePath = (imageFile != null) ? imageFile.getSavePath() : null;

                return new ReviewResponse(
                                review.getId(),
                                review.getTitle(),
                                review.getReleased(),
                                review.getTracklist(),
                                artistResponses,
                                categoryResponses,
                                reviewCommentService.getAverageStarPoint(review.getId()),
                                imagePath);
        }

        @Transactional
        public void createReview(ReviewRequest req, HttpServletRequest tokenRequest) {
                String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

                if (!jwtTokenProvider.validateToken(token)) {
                        throw new UnauthorizedException();
                }

                Long memberId = jwtTokenProvider.getUserIdFromToken(token);
                Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

                AuthUtil.validateAdmin(member);

                // 이미지파일 생성
                ImageFile imageFile = null;
                if (req.getImage() != null && !req.getImage().isEmpty()) {
                        imageFile = imageService.imageUpload(req.getImage());
                } else {
                        throw new IllegalArgumentException();
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

        public List<ReviewSimpleResponse> getLatest() {
                List<Review> reviewList = reviewRepository.findTop4ByOrderByCreatedDateDesc()
                                .orElseThrow(NotFoundReviewException::new);

                return reviewList.stream()
                                .map(review -> {
                                        List<AlbumArtist> albumArtists = albumArtistRepository
                                                        .findByReviewId(review.getId());
                                        List<ArtistResponse> artistResponses = albumArtists.stream().map(
                                                        a -> new ArtistResponse(
                                                                        a.getArtist().getId(),
                                                                        a.getArtist().getName()))
                                                        .toList();

                                        ImageFile imageFile = review.getImageFile();
                                        String imagePath = imageFile.getSavePath();

                                        return new ReviewSimpleResponse(
                                                        review.getId(),
                                                        review.getTitle(),
                                                        reviewCommentService.getAverageStarPoint(review.getId()),
                                                        artistResponses,
                                                        imagePath);

                                })
                                .toList();
        }
}
