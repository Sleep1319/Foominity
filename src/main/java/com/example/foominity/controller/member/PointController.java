package com.example.foominity.controller.member;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.member.PointResponse;
import com.example.foominity.service.member.PointService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@Slf4j
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    @GetMapping("/api/point/{memberId}")
    public ResponseEntity<PointResponse> findAll(@PathVariable Long memberId) {
        PointResponse res = pointService.getPoint(memberId);

        return ResponseEntity.ok(res);
    }

    @PutMapping("/api/point/review/{memberId}")
    public ResponseEntity<String> updateReviewCount(@PathVariable Long memberId) {
        pointService.updateReviewCount(memberId);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/point/like/{memberId}")
    public ResponseEntity<String> updateLikeCount(@PathVariable Long memberId) {
        pointService.updateLikeCount(memberId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/point/reset/{memberId}")
    public ResponseEntity<String> resetPoint(@PathVariable Long memberId) {

        pointService.resetPoint(memberId);

        return ResponseEntity.ok().build();
    }

}
