package com.example.foominity.service.openai;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.foominity.dto.artist.ArtistSimpleResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.openai.AlbumRecommendRequest;
import com.example.foominity.dto.openai.ArtistRecommendRequest;
import com.example.foominity.repository.artist.ArtistRepository;
import com.example.foominity.service.artist.ArtistService;
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

    public List<ReviewSimpleResponse> getRecommendationsFromOpenAI(Long reviewId) throws IOException {
        AlbumRecommendRequest req = reviewService.buildRecommendRequest(reviewId);
        // 앨범명 리스트
        List<String> gptAlbumTitles = openAIService.askAlbumRecommendations(req);

        List<ReviewSimpleResponse> results = new ArrayList<>();
        Set<Long> alreadyAddedIds = new HashSet<>();
        alreadyAddedIds.add(reviewId);

        // AI 추천 앨범과 DB에 저장된 리뷰 앨범 매칭 후 추가
        for (String title : gptAlbumTitles) {
            reviewService.findByTitle(title).ifPresent(res -> {
                if (!alreadyAddedIds.contains(res.getId())) { // 중복제거
                    results.add(res);
                    alreadyAddedIds.add(res.getId());
                }
            });
            if (results.size() == 5)
                break;
        }

        // 추가된 앨범이 부족할 경우 유사 카테고리 앨범으로 추가
        if (results.size() < 5) {
            List<ReviewSimpleResponse> fallback = reviewService.findByCategory(req.getCategory());
            for (ReviewSimpleResponse review : fallback) {
                if (!alreadyAddedIds.contains(review.getId())) {
                    results.add(review);
                    alreadyAddedIds.add(review.getId());
                    if (results.size() == 5)
                        break;
                }
            }
        }

        log.info("🎯 GPT 추천 앨범명 리스트:");
        results.forEach(r -> log.info("▶ {}", r.getTitle()));

        return results;

    }

    public List<ArtistSimpleResponse> getArtistRecommendationsFromOpenAI(Long artistId) throws IOException {
        ArtistRecommendRequest req = artistService.buildRecommendRequest(artistId);

        List<String> gptArtistNames = openAIService.askArtistRecommendations(req);

        List<ArtistSimpleResponse> results = new ArrayList<>();
        Set<Long> alreadyAddedIds = new HashSet<>();
        alreadyAddedIds.add(artistId);

        // AI - DB 매칭
        for (String name : gptArtistNames) {
            artistService.findByName(name).ifPresent(res -> {
                if (!alreadyAddedIds.contains(res.getId())) {
                    results.add(res);
                    alreadyAddedIds.add(res.getId());
                }
            });
            if (results.size() == 5) {
                break;
            }
        }

        // 추가된 아티스트가 부족할 경우 유사 카테고리 아티스트로 추가
        if (results.size() < 5) {
            List<ArtistSimpleResponse> fallback = artistService.findByCategory(req.getCategory());
            for (ArtistSimpleResponse artist : fallback) {
                if (!alreadyAddedIds.contains(artist.getId())) {
                    results.add(artist);
                    alreadyAddedIds.add(artist.getId());
                    if (results.size() == 5) {
                        break;
                    }
                }
            }
        }

        log.info("🎯 GPT 추천 아티스트 리스트:");
        results.forEach(a -> log.info("▶ {}", a.getName()));

        return results;
    }

}
