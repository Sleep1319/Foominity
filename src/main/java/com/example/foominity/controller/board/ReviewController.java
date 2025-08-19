package com.example.foominity.controller.board;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.foominity.dto.board.ReviewRequest;
import com.example.foominity.dto.board.ReviewResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.board.ReviewUpdateRequest;
import com.example.foominity.service.board.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@Slf4j
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** 전체 조회 */
    @GetMapping
    public ResponseEntity<Page<ReviewSimpleResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(defaultValue = "latest") String sort) {
        Page<ReviewSimpleResponse> res = reviewService.findAll(page, search, categories, sort);
        return ResponseEntity.ok(res);
    }

    // 탑10 앨범 리스트
    @GetMapping("/top-albums")
    public ResponseEntity<List<ReviewSimpleResponse>> getTopReviews() {
        List<ReviewSimpleResponse> top10 = reviewService.getTopRankedReviews();
        return ResponseEntity.ok(top10);
    }

    /** 개별 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> findById(
            @PathVariable Long id) {
        return ResponseEntity.ok(reviewService.readReview(id));
    }

    // 생성 (메타데이터 + 이미지 한 번에 업로드)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createReview(
            @Valid @ModelAttribute ReviewRequest req,
            HttpServletRequest tokenRequest) {
        reviewService.createReview(req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    /** 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateRequest req,
            HttpServletRequest tokenRequest) {
        reviewService.updateReview(id, req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    /** 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            HttpServletRequest tokenRequest) {
        reviewService.deleteReview(id, tokenRequest);
        return ResponseEntity.ok().build();
    }

}