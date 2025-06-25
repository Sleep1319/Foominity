package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.board.BoardRequest;
import com.example.foominity.dto.board.BoardUpdateRequest;
import com.example.foominity.dto.board.ReviewRequest;
import com.example.foominity.dto.board.ReviewResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.board.ReviewUpdateRequest;
import com.example.foominity.service.board.ReviewService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 전체 조회
    @GetMapping("/api/reviews")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<ReviewSimpleResponse> res = reviewService.findAll(page);
        return ResponseEntity.ok(res);
    }

    // 개별 조회
    @GetMapping("/api/reviews/{id}")
    public ResponseEntity<ReviewResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.readReview(id));
    }

    // @GetMapping("/api/reviews/top")
    // public ResponseEntity<List<ReviewResponse>> getTop3LikeReviews() {
    // return ResponseEntity.ok(reviewService.getTop3LikeReviews(3));
    // }

    // 생성
    @PostMapping("/api/reviews")
    public ResponseEntity<String> createReview(@Valid @RequestBody ReviewRequest req,
            HttpServletRequest tokenRequest) {
        reviewService.createReview(req, tokenRequest);

        return ResponseEntity.ok().build();
    }

    // 수정
    @PutMapping("/api/reviews/{id}")
    public ResponseEntity<String> updateReview(@PathVariable Long id, @Valid @RequestBody ReviewUpdateRequest req,
            HttpServletRequest tokenRequest) {
        reviewService.updateReview(id, req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id, HttpServletRequest tokenRequest) {
        reviewService.deleteReview(id, tokenRequest);
        return ResponseEntity.ok().build();
    }

}
