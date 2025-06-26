package com.example.foominity.controller.notice;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.notice.NoticeRequest;
import com.example.foominity.dto.notice.NoticeResponse;
import com.example.foominity.service.notice.NoticeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Slf4j
@RequiredArgsConstructor
@RestController
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/api/notices/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<NoticeResponse> res = noticeService.findAll(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/notices")
    public ResponseEntity<List<NoticeResponse>> findAllNotices() {
    List<NoticeResponse> res = noticeService.findAllNotices(); // 전체 조회용 서비스 메서드
    return ResponseEntity.ok(res);
}

    @GetMapping("/api/notices/{id}")
    public ResponseEntity<NoticeResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findByID(id));
    }

    @PostMapping("/api/notices/add")
    public ResponseEntity<String> createNotice(@Valid @RequestBody NoticeRequest req, HttpServletRequest request) {
        noticeService.createNotice(req, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/notices/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id, HttpServletRequest request) {
        noticeService.deleteNotice(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/notices/main/{id}")
    public ResponseEntity<String> changeMainNotice(@PathVariable Long id, HttpServletRequest request) {
        noticeService.changeMainNotice(id, request);
        return ResponseEntity.ok().build();
    }

}
