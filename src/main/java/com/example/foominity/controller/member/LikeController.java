package com.example.foominity.controller.member;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.member.LikeRequest;
import com.example.foominity.service.member.LikeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@Slf4j
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PutMapping("/api/reviews/{reviewId}/like")
    public ResponseEntity<String> changeLike(@PathVariable Long reviewId, HttpServletRequest tokenRequest,
            @Valid @RequestBody LikeRequest req) {

        likeService.like(reviewId, tokenRequest, req);

        return ResponseEntity.ok().build();
    }

}
