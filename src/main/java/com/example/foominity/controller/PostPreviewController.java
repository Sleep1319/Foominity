package com.example.foominity.controller;

import com.example.foominity.exception.NotFoundPostCategory;
import com.example.foominity.service.board.BoardService;
import com.example.foominity.service.board.ReviewService;
import com.example.foominity.service.magazine.MagazineService;
import com.example.foominity.service.report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PostPreviewController {

    private final ReviewService reviewService;
    private final BoardService boardService;
    private final MagazineService magazineService;
    private final ReportService reportService;

    @GetMapping("/api/{category}/latest")
    public ResponseEntity<?> getLatestPostsByCategory(@PathVariable String category) {
        switch (category.toLowerCase()) {
            case "review":
                return ResponseEntity.ok(reviewService.getLatest());
            case "freeboard":
                return ResponseEntity.ok(boardService.getLatest());
            case "notice":
                return ResponseEntity.ok(magazineService.getLatest());
            default:
                throw new NotFoundPostCategory();
        }
    }

}
