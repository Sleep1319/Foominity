package com.example.foominity.controller.notice;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.magazine.MagazineRequest;
import com.example.foominity.dto.magazine.MagazineResponse;
import com.example.foominity.service.magazine.MagazineService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;

@Slf4j
@RequiredArgsConstructor
@RestController
public class NoticeController {

    private final MagazineService magazineService;

    @GetMapping("/api/notices/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<MagazineResponse> res = magazineService.findAll(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/notices")
    public ResponseEntity<List<MagazineResponse>> findAllNotices() {
        List<MagazineResponse> res = magazineService.findAllNotices(); // 전체 조회용 서비스 메서드
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/notices/{id}")
    public ResponseEntity<MagazineResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(magazineService.findByID(id));
    }

    @PostMapping(value = "/api/notices/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createNotice(
            @Valid @ModelAttribute MagazineRequest req,
            HttpServletRequest request) {

        magazineService.createNotice(req, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/notices/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id, HttpServletRequest request) {
        magazineService.deleteNotice(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/notices/main/{id}")
    public ResponseEntity<String> changeMainNotice(@PathVariable Long id, HttpServletRequest request) {
        magazineService.changeMainNotice(id, request);
        return ResponseEntity.ok().build();
    }

}
