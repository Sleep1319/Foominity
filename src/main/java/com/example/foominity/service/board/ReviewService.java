package com.example.foominity.service.board;

import java.time.LocalDateTime;
import java.util.Comparator;
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
import com.example.foominity.dto.openai.AlbumRecommendRequest;
import com.example.foominity.dto.openai.LikeRecommendRequest;
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
        public Page<ReviewSimpleResponse> findAll(int page, String search, List<String> categories) {
                PageRequest pageable = PageRequest.of(page, 12, Sort.by(Sort.Direction.DESC, "id"));
                List<Review> reviews;

                if (categories != null && !categories.isEmpty()) {
                        // 카테고리 필터가 있는 경우: 전체 가져오고 id desc 정렬 후 subList로 자름
                        reviews = reviewRepository.findByCategories(categories, categories.size())
                                        .stream()
                                        .sorted(Comparator.comparing(Review::getId).reversed())
                                        .toList();

                        int start = (int) pageable.getOffset();
                        int end = Math.min(start + pageable.getPageSize(), reviews.size());
                        List<Review> paged = reviews.subList(start, end);

                        List<ReviewSimpleResponse> content = toSimpleResponseList(paged);
                        return new PageImpl<>(content, pageable, reviews.size());
                }

                // 카테고리 필터 없을 경우: DB에서 직접 페이징
                Page<Review> pageResult = reviewRepository.findAll(pageable);
                List<ReviewSimpleResponse> content = toSimpleResponseList(pageResult.getContent());
                return new PageImpl<>(content, pageable, pageResult.getTotalElements());
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

        // 내가 평가 참여한 앨범 가져오기
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

                        LocalDateTime createdDate = rc.getCreatedDate(); // BaseEntity에서 상속됨

                        return new MemberReviewResponse(
                                        review.getId(),
                                        review.getTitle(),
                                        path,
                                        avg,
                                        userStar,
                                        artistResp,
                                        catResp,
                                        createdDate);
                }).toList();
        }

        // 좋아요 앨범
        public List<MemberReviewResponse> getLikedReviews(Long memberId) {
                // 1. 내가 좋아요 누른 리뷰(앨범) 가져오기
                List<ReviewLike> likes = reviewLikeRepository.findByMemberId(memberId);

                return likes.stream().map(rl -> {
                        Review review = reviewRepository.findById(rl.getReviewId()).orElseThrow();

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

        // 제목으로 조회
        public Optional<ReviewSimpleResponse> findByTitle(String title) {

                return reviewRepository.findByTitle(title)
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
                                });
        }

        public List<ReviewSimpleResponse> findByCategory(List<String> categories) {
                List<Review> matched = reviewRepository.findByCategories(categories, categories.size());

                return matched.stream().map(review -> {
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
                }).toList();
        }

        public List<ReviewSimpleResponse> findByCategoryOr(List<String> categories) {
                if (categories == null || categories.isEmpty()) {
                        return List.of(); // 비어있으면 빈 리스트 반환 (원하는 동작에 맞게 조정)
                }

                // 필요 시 정규화(트림/소문자)
                List<String> names = categories.stream()
                                .filter(s -> s != null && !s.isBlank())
                                .map(String::trim)
                                // .map(String::toLowerCase) // Repo 쿼리를 LOWER 비교로 바꿨다면 주석 해제
                                .toList();

                List<Review> matched = reviewRepository.findByAnyCategoryNames(names);

                return matched.stream().map(review -> {
                        List<AlbumArtist> albumArtists = albumArtistRepository.findByReviewId(review.getId());
                        List<ArtistSimpleResponse> artistSimpleResponses = albumArtists.stream()
                                        .map(a -> {
                                                Artist artist = a.getArtist();
                                                ImageFile artistImageFile = artist.getImageFile();
                                                String artistImagePath = (artistImageFile != null)
                                                                ? artistImageFile.getSavePath()
                                                                : null;
                                                return new ArtistSimpleResponse(artist.getId(), artist.getName(),
                                                                artistImagePath);
                                        }).toList();

                        List<ReviewCategory> reviewCategory = reviewCategoryRepository.findByReviewId(review.getId());
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
                }).toList();
        }

        public List<String> getCategoriesByMemberId(Long memberId) {
                // 1. 사용자가 평가한 리뷰 ID 리스트 가져오기
                List<Long> reviewIds = reviewCommentRepository.findByMemberId(memberId).stream()
                                .map(rc -> rc.getReview().getId())
                                .distinct()
                                .toList();

                // 2. 리뷰 ID 별로 ReviewCategory 찾아서 category 이름만 뽑기
                return reviewIds.stream()
                                .flatMap(reviewId -> reviewCategoryRepository.findByReviewId(reviewId).stream()
                                                .map(rc -> rc.getCategory().getCategoryName()))
                                .distinct()
                                .toList();
        }

        // 앨범 맞춤 추천 ai
        public AlbumRecommendRequest toAlbumRecommend(ReviewResponse review) {

                List<ReviewCategory> reviewCategories = reviewCategoryRepository.findByReviewId(review.getId());
                List<AlbumArtist> albumArtists = albumArtistRepository.findByReviewId(review.getId());

                List<String> categories = reviewCategories.stream()
                                .map(rc -> rc.getCategory().getCategoryName())
                                .toList();

                List<String> artists = albumArtists.stream()
                                .map(aa -> aa.getArtist().getName())
                                .toList();

                String categoryText = categories.isEmpty() ? "" : String.join(", ", categories) + " 장르에 속합니다.";
                String artistText = artists.isEmpty() ? "" : String.join(", ", artists) + "";

                String focus = String.format(
                                "이 앨범은 %s %s와 협업 경험이 많은 아티스트 위주로 해당 앨범과 서브장르, 사운드가 최대한 유사한 앨범을 추천해 주세요.",
                                categoryText,
                                artistText).trim();

                return new AlbumRecommendRequest(
                                review.getTitle(),
                                artists,
                                categories,
                                "유사도를 중점으로 정밀하게 분석",
                                focus);
        }

        // 앨범 맞춤 추천 ai 리팩토링
        public AlbumRecommendRequest buildRecommendRequest(Long reviewId) {
                ReviewResponse review = readReview(reviewId);
                return toAlbumRecommend(review);

        }

        // 사용자 정보 기반 앨범 맞춤 추천 ai
        public LikeRecommendRequest LikeAlbumRecommend(Long memberId) {

                List<String> reviewAlbum = reviewCommentRepository.findByMemberId(memberId).stream()
                                .map(rc -> rc.getReview().getTitle())
                                .distinct()
                                .toList();

                List<String> likeAlbum = reviewLikeRepository.findByMemberId(memberId).stream()
                                .map(rl -> reviewRepository.findById(rl.getReviewId())
                                                .map(Review::getTitle)
                                                .orElse("제목 없음"))
                                .distinct()
                                .toList();

                List<Long> reviewIds = reviewCommentRepository.findByMemberId(memberId).stream()
                                .map(rc -> rc.getReview().getId())
                                .distinct()
                                .toList();

                List<String> categories = reviewIds.stream()
                                .flatMap(id -> reviewCategoryRepository.findByReviewId(id).stream()
                                                .map(c -> c.getCategory().getCategoryName()))
                                .distinct()
                                .toList();

                String focus = String.format("""
                                사용자가 평가한 앨범은 %s 이며,
                                사용자가 좋아요 한 앨범은 %s 입니다.
                                사용자가 좋게 평가한 앨범, 좋아요한 앨범들과 서브장르, 사운드가 유사한 앨범을 추천해주세요.
                                """, String.join(", ", reviewAlbum),
                                String.join(", ", likeAlbum));

                return new LikeRecommendRequest(
                                reviewAlbum,
                                likeAlbum,
                                "유사도를 중점으로 정밀하게 분석",
                                focus,
                                categories);
        }

        public LikeRecommendRequest buildLikeRecommendRequest(Long memberId) {
                Member member = memberRepository.findById(memberId).orElseThrow();
                return LikeAlbumRecommend(member.getId());
        }

        private List<ReviewSimpleResponse> toSimpleResponseList(List<Review> reviews) {
                return reviews.stream().map(review -> {
                        List<AlbumArtist> albumArtists = albumArtistRepository.findByReviewId(review.getId());

                        List<ArtistSimpleResponse> artistSimpleResponses = albumArtists.stream()
                                        .map(a -> {
                                                Artist artist = a.getArtist();
                                                String artistImagePath = (artist.getImageFile() != null)
                                                                ? artist.getImageFile().getSavePath()
                                                                : null;
                                                return new ArtistSimpleResponse(artist.getId(), artist.getName(),
                                                                artistImagePath);
                                        }).toList();

                        List<ReviewCategoryResponse> categoryResponses = reviewCategoryRepository
                                        .findByReviewId(review.getId())
                                        .stream()
                                        .map(rc -> new ReviewCategoryResponse(
                                                        rc.getCategory().getId(),
                                                        rc.getCategory().getCategoryName()))
                                        .toList();

                        String imagePath = (review.getImageFile() != null) ? review.getImageFile().getSavePath() : null;

                        return new ReviewSimpleResponse(
                                        review.getId(),
                                        review.getTitle(),
                                        reviewCommentService.getAverageStarPoint(review.getId()),
                                        artistSimpleResponses,
                                        categoryResponses,
                                        imagePath);
                }).toList();
        }

}
