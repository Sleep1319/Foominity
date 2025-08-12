package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.comment.ReviewCommentRequest;
import com.example.foominity.dto.comment.ReviewCommentResponse;
import com.example.foominity.dto.comment.ReviewCommentUpdateRequest;
import com.example.foominity.service.board.ReviewCommentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ReviewCommentController {
    private final ReviewCommentService reviewCommentService;

    // 전체 조회
    @GetMapping("/api/reviews/{reviewId}/comments")
    public ResponseEntity<List<ReviewCommentResponse>> findAll(@PathVariable Long reviewId) {
        List<ReviewCommentResponse> res = reviewCommentService.getList(reviewId);
        return ResponseEntity.ok(res);
    }

    // 생성
    @PostMapping("/api/reviews/{reviewId}/comments")
    public ResponseEntity<String> createReviewComment(@PathVariable Long reviewId, HttpServletRequest tokenRequest,
            @Valid @RequestBody ReviewCommentRequest req) {
        reviewCommentService.createReviewComment(reviewId, tokenRequest, req);
        return ResponseEntity.ok().build();
    }

    // 수정
    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<String> updateReviewComment(@PathVariable Long commentId, HttpServletRequest tokenRequest,
            @Valid @RequestBody ReviewCommentUpdateRequest req) {
        reviewCommentService.updateReviewComment(commentId, tokenRequest, req);
        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<String> deleteReviewComment(@PathVariable Long commentId,
            HttpServletRequest tokenRequest) {
        reviewCommentService.deleteReviewComment(commentId, tokenRequest);
        return ResponseEntity.ok().build();
    }

    // 코멘트 갯수 조회
    @GetMapping("/api/reviews/{reviewId}/comments/count")
    public ResponseEntity<Long> getCommentCount(@PathVariable Long reviewId) {
        long count = reviewCommentService.getCommentCount(reviewId);
        return ResponseEntity.ok(count);
    }

}
