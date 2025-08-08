package com.example.foominity.controller.openai;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.dto.artist.ArtistSimpleResponse;
import com.example.foominity.dto.board.ReviewResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.category.CategoryResponse;
import com.example.foominity.dto.openai.AlbumRecommendRequest;
import com.example.foominity.service.board.ReviewService;
import com.example.foominity.service.openai.OpenAIService;
import com.example.foominity.service.openai.RecommendationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@Slf4j
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendationService recommendationService;

    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/api/reviews/{id}/recommend")
    public ResponseEntity<List<ReviewSimpleResponse>> recommendByReview(@PathVariable Long id) {

        try {
            List<ReviewSimpleResponse> results = recommendationService.getRecommendationsFromOpenAI(id);
            return ResponseEntity.ok(results);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    @GetMapping("/api/artists/{id}/recommend")
    public ResponseEntity<List<ArtistSimpleResponse>> recommendByArtist(@PathVariable Long id) {

        try {
            List<ArtistSimpleResponse> results = recommendationService.getArtistRecommendationsFromOpenAI(id);
            return ResponseEntity.ok(results);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    @GetMapping("/api/me/recommend")
    public ResponseEntity<List<ReviewSimpleResponse>> recommendByLikeAlbum(HttpServletRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(req);
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        try {
            List<ReviewSimpleResponse> results = recommendationService.getLikeRecommendationsFromOpenAI(memberId);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

}
