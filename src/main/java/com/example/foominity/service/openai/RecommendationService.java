package com.example.foominity.service.openai;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.example.foominity.domain.member.ReviewLike;
import org.springframework.stereotype.Service;

import com.example.foominity.dto.artist.ArtistSimpleResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.openai.AlbumRecommendRequest;
import com.example.foominity.dto.openai.ArtistRecommendRequest;
import com.example.foominity.dto.openai.CommentSummaryRequest;
import com.example.foominity.dto.openai.CommentSummaryResponse;
import com.example.foominity.dto.openai.LikeRecommendRequest;
import com.example.foominity.repository.artist.ArtistRepository;
import com.example.foominity.repository.board.ReviewCommentRepository;
import com.example.foominity.repository.member.ReviewLikeRepository;
import com.example.foominity.service.artist.ArtistService;
import com.example.foominity.service.board.ReviewCommentService;
import com.example.foominity.service.board.ReviewService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final ReviewService reviewService;
    private final OpenAIService openAIService;
    private final ArtistService artistService;
    private final ArtistRepository artistRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final ReviewCommentService reviewCommentService;

    public List<ReviewSimpleResponse> getRecommendationsFromOpenAI(Long reviewId) throws IOException {
        // 1) GPT에 유사 앨범 질의
        AlbumRecommendRequest req = reviewService.buildRecommendRequest(reviewId);
        List<String> gptAlbumTitles = Optional.ofNullable(openAIService.askAlbumRecommendations(req))
                .orElseGet(List::of);
        log.info("🤖 GPT 원본 앨범명 ({}): {}", gptAlbumTitles.size(), gptAlbumTitles);

        // 2) DB의 앨범명과 매칭 후 추가
        List<ReviewSimpleResponse> results = new ArrayList<>();
        Set<Long> alreadyAddedIds = new HashSet<>();
        alreadyAddedIds.add(reviewId); // 자기 자신 제외

        List<String> matched = new ArrayList<>();
        List<String> unmatched = new ArrayList<>();

        for (String title : gptAlbumTitles) {
            Optional<ReviewSimpleResponse> found = reviewService.findByTitle(title);
            if (found.isPresent()) {
                ReviewSimpleResponse res = found.get();
                if (alreadyAddedIds.add(res.getId())) { // 중복 방지
                    results.add(res);
                    matched.add(title);
                }
            } else {
                unmatched.add(title);
            }
            if (results.size() == 5)
                break; // 최대 5개까지만
        }

        log.info("✅ DB 매칭 성공 ({}): {}", matched.size(), matched);
        log.info("❌ DB 매칭 실패 ({}): {}", unmatched.size(), unmatched);

        // 3) 부족하면 같은 카테고리로 채우기 (정렬 없음, 그대로 순회)
        if (results.size() < 5) {
            // req.getCategory() 가 List<String> 라면 그대로 넘기기
            List<String> cats = req.getCategory(); // 로그에서 [Alternative, Experimental HipHop, Pop Rap] 형태였음
            log.info("🧭 fallback 카테고리(OR): {}", cats);

            List<ReviewSimpleResponse> fallback = reviewService.findByCategoryOr(cats);
            log.info("🧭 fallback 원 후보 개수: {}", fallback.size());

            for (ReviewSimpleResponse review : fallback) {
                if (alreadyAddedIds.add(review.getId())) { // 자기 자신/중복 제외
                    results.add(review);
                    if (results.size() == 5)
                        break; // 최대 5개까지만
                }
            }

            log.info("🧩 Fallback 추가 후 개수: {}", results.size());
        }

        // 최종 결과
        log.info("🏁 최종 추천 결과 ({}개): {}", results.size(),
                results.stream().map(ReviewSimpleResponse::getTitle).toList());

        return results;
    }

    public List<ArtistSimpleResponse> getArtistRecommendationsFromOpenAI(Long artistId) throws IOException {
        // 1) GPT에 유사 아티스트 질의
        ArtistRecommendRequest req = artistService.buildRecommendRequest(artistId);
        List<String> gptArtistNames = Optional.ofNullable(openAIService.askArtistRecommendations(req))
                .orElseGet(List::of);
        log.info("🤖 GPT 원본 아티스트명 ({}): {}", gptArtistNames.size(), gptArtistNames);

        // 2) DB 매칭
        List<ArtistSimpleResponse> results = new ArrayList<>();
        Set<Long> alreadyAddedIds = new HashSet<>();
        alreadyAddedIds.add(artistId); // 자기 자신 제외

        List<String> matched = new ArrayList<>();
        List<String> unmatched = new ArrayList<>();

        for (String name : gptArtistNames) {
            Optional<ArtistSimpleResponse> opt = artistService.findByName(name);
            if (opt.isPresent()) {
                ArtistSimpleResponse res = opt.get();
                if (alreadyAddedIds.add(res.getId())) { // 중복 방지
                    results.add(res);
                    matched.add(name);
                }
            } else {
                unmatched.add(name);
            }
            if (results.size() == 5)
                break; // 최대 5개
        }

        log.info("✅ DB 매칭 성공 ({}): {}", matched.size(), matched);
        log.info("❌ DB 매칭 실패 ({}): {}", unmatched.size(), unmatched);

        // 3) 부족하면 같은 카테고리로 채우기 (정렬 없음)
        if (results.size() < 5) {
            List<String> cats = req.getCategory();
            log.info("🧭 fallback 카테고리(OR): {}", cats);

            List<ArtistSimpleResponse> fallback = artistService.findByCategoryOr(req.getCategory());
            log.info("🧭 fallback 원 후보 개수: {}", fallback.size());

            for (ArtistSimpleResponse artist : fallback) {
                if (alreadyAddedIds.add(artist.getId())) {
                    results.add(artist);
                    if (results.size() == 5)
                        break;
                }
            }
            log.info("🧩 Fallback 추가 ({}): {}", results.size());
        }

        // 4) 최종 결과
        log.info("🏁 최종 추천 아티스트 ({}개): {}", results.size(),
                results.stream().map(ArtistSimpleResponse::getName).toList());

        return results;
    }

    public List<ReviewSimpleResponse> getLikeRecommendationsFromOpenAI(Long memberId) throws IOException {
        LikeRecommendRequest req = reviewService.buildLikeRecommendRequest(memberId);
        List<String> gptAlbumTitles = openAIService.askLikeRecommendations(req);

        List<ReviewSimpleResponse> results = new ArrayList<>();
        Set<Long> alreadyAddedIds = new HashSet<>();

        // ✅ [1] 평가한 앨범 + 좋아요 누른 앨범 ID 수집
        Set<Long> excludedIds = new HashSet<>();

        reviewCommentRepository.findByMemberId(memberId).stream()
                .map(rc -> rc.getReview().getId())
                .forEach(excludedIds::add);

        reviewLikeRepository.findByMemberId(memberId).stream()
                .map(ReviewLike::getReviewId)
                .forEach(excludedIds::add);

        // ✅ [2] GPT 앨범명 중 DB에 존재하는 것만 + 제외 대상 걸러서 추가
        for (String title : gptAlbumTitles) {
            reviewService.findByTitle(title).ifPresent(res -> {
                if (!excludedIds.contains(res.getId()) && !alreadyAddedIds.contains(res.getId())) {
                    results.add(res);
                    alreadyAddedIds.add(res.getId());
                }
            });
            if (results.size() == 5)
                break;
        }

        // ✅ 부족할 경우 카테고리 기반 fallback으로 채우기
        if (results.size() < 5) {
            List<String> categories = reviewService.getCategoriesByMemberId(memberId); // 사용자 선호 카테고리 추출
            List<ReviewSimpleResponse> fallback = reviewService.findByCategory(categories);
            for (ReviewSimpleResponse review : fallback) {
                if (!excludedIds.contains(review.getId()) && !alreadyAddedIds.contains(review.getId())) {
                    results.add(review);
                    alreadyAddedIds.add(review.getId());
                    if (results.size() == 5)
                        break;
                }
            }
        }

        log.info("🎯 GPT 추천 앨범명 리스트 (최종 필터링 후):");
        results.forEach(r -> log.info("▶ {}", r.getTitle()));

        return results;
    }

    public CommentSummaryResponse getCommentSummaryFromOpenAI(Long reviewId) throws IOException {
        CommentSummaryRequest req = reviewCommentService.toCommentSummary(reviewId);
        return openAIService.askCommentSummary(req);
    }
}
