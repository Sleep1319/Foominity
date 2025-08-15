package com.example.foominity.controller.notice;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.magazine.MagazineRequest;
import com.example.foominity.dto.magazine.MagazineResponse;
import com.example.foominity.dto.magazine.PendingMagazine;
import com.example.foominity.exception.NoPendingNewsException;
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

    // 페이지네이션 조회
    @GetMapping("/api/notices/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<MagazineResponse> res = magazineService.findAll(page);
        return ResponseEntity.ok(res);
    }

    // 전체 목록 단건 리스트 조회(비페이징)
    @GetMapping("/api/notices")
    public ResponseEntity<List<MagazineResponse>> findAllNotices() {
        List<MagazineResponse> res = magazineService.findAllNotices(); 
        return ResponseEntity.ok(res);
    }

    // 상세 조회
    @GetMapping("/api/notices/{id}")
    public ResponseEntity<MagazineResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(magazineService.findByID(id));
    }

    // 매거진 생성
    @PostMapping(value = "/api/notices/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createNotice(
            @Valid @ModelAttribute MagazineRequest req,
            HttpServletRequest request) {

        magazineService.createNotice(req, request);
        return ResponseEntity.ok().build();
    }

    // 매거진 삭제
    @DeleteMapping("/api/notices/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id, HttpServletRequest request) {
        magazineService.deleteNotice(id, request);
        return ResponseEntity.ok().build();
    }

    // (관리자 검수용) 다음 대기 기사 1건 가져오기
    @GetMapping("/api/notices/pending")
    public ResponseEntity<PendingMagazine> getNextPending() {
        try {
            PendingMagazine pending = magazineService.getNextPending();
            return ResponseEntity.ok(pending);
        } catch (NoPendingNewsException e) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
    }

    // (관리자 최종 등록) 대기 기사 게시 처리
    @PostMapping(value = "/api/notices/publish", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> publishPending(
            @ModelAttribute @Valid MagazineRequest req,
            HttpServletRequest request) {

        magazineService.publishPending(req, request);
        return ResponseEntity.ok().build();
    }

}
