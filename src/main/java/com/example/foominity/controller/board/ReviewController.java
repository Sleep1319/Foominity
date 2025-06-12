package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.board.ReviewCreateRequest;
import com.example.foominity.dto.board.ReviewUpdateRequest;
import com.example.foominity.service.board.ReviewService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/api/reviews/page")
    public String findAll(@RequestParam String param) {
        return null;
    }

    @GetMapping("/api/reviews/{id}")
    public String findById(@RequestParam String param) {
        return null;
    }

    @PostMapping("/api/reviews")
    public ResponseEntity<String> ceateReview(@Valid @RequestBody ReviewCreateRequest req,
            HttpServletRequest tokenRequest) {
        reviewService.createReview(req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/reviews{id}")
    public ResponseEntity<String> updateReview(@PathVariable Long id, @Valid @RequestBody ReviewUpdateRequest req,
            HttpServletRequest tokenRequest) {
        reviewService.updateReview(id, req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/reviews")
    public ResponseEntity<String> deleteReview(@PathVariable Long id, HttpServletRequest tokenRequest) {
        reviewService.deleteReview(id, tokenRequest);
        return ResponseEntity.ok().build();

    }

}
