package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.comment.ReviewCommentRequest;
import com.example.foominity.dto.comment.ReviewCommentResponse;
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

    @GetMapping("/api/boards/{id}/comments")
    public ResponseEntity<List<ReviewCommentResponse>> findAll(@PathVariable Long id) {
        List<ReviewCommentResponse> res = reviewCommentService.getList(id);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/comments")
    public ResponseEntity<String> createReviewComment(@Valid @RequestBody ReviewCommentRequest req) {
        reviewCommentService.createReviewComment(req);
        return ResponseEntity.ok().build();
    }

    // id 토큰 필요

    // @PutMapping("/api/comments/{id}")
    // public ResponseEntity<String> updateReviewComment(@PathVariable Long id,
    // @Valid @RequestBody ReviewCommentRequest req, HttpServletRequest
    // tokenRequest) {
    // reviewCommentService.updateReviewComment(id, req, tokenRequest);
    // return ResponseEntity.ok().build();
    // }

    // @DeleteMapping("/api/comments/{id}")
    // public ResponseEntity<String> deleteReviewComment(@PathVariable Long id,
    // HttpServletRequest tokenRequest) {
    // reviewCommentService.deleteReviewComment(id, tokenRequest);
    // return ResponseEntity.ok().build();
    // }

}
