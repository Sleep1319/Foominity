// src/main/java/com/example/foominity/controller/member/ReviewLikeController.java
package com.example.foominity.controller.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.service.member.ReviewLikeService;

@RestController
@RequiredArgsConstructor
public class ReviewLikeController {

    private final ReviewLikeService likeService;
    private final JwtTokenProvider jwtTokenProvider;
    private final ReviewLikeService reviewLikeService;

    /** 리뷰 좋아요 개수 조회 */
    @GetMapping("/api/reviews/{reviewId}/likes")
    public ResponseEntity<Map<String, Object>> getLikeInfo(
            @PathVariable Long reviewId, HttpServletRequest req) {
        // 토큰에서 유저 id 파싱 (비로그인 시 null)
        String token = jwtTokenProvider.resolveTokenFromCookie(req);
        Long memberId = null;
        if (token != null) {
            memberId = jwtTokenProvider.getUserIdFromToken(token);
        }

        long count = reviewLikeService.countLikes(reviewId);
        boolean liked = false;

        if (memberId != null) {
            liked = reviewLikeService.isLikedByMember(reviewId, memberId);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("count", count);
        result.put("liked", liked);
        return ResponseEntity.ok(result);
    }

    /** 리뷰 좋아요 토글 */
    @PostMapping("/api/reviews/{reviewId}/likes")
    public ResponseEntity<Boolean> toggleLike(
            @PathVariable Long reviewId,
            HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (token == null) {
            // 401 Unauthorized 리턴 (프론트에서 감지)
            // 왜 401 주냐면, 프론트에서 좋아요 눌렀을 때 로그인 안 한 유저한테만 모달창 띄우려고(401상태로 구분하게)
            return ResponseEntity.status(401).build();
        }
        boolean added = likeService.toggleLike(reviewId, request);
        return ResponseEntity.ok(added);
    }

    /** 내가 좋아요 누른 리뷰(앨범) 리스트 */
    @GetMapping("/api/members/me/liked-reviews")
    public ResponseEntity<List<ReviewSimpleResponse>> myLikedReviews(
            HttpServletRequest request) {
        List<ReviewSimpleResponse> list = likeService.getMyLikedReviews(request);
        return ResponseEntity.ok(list);
    }
}
