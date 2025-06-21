package com.example.foominity.controller.notice;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.notice.NoticeRequest;
import com.example.foominity.dto.notice.NoticeResponse;
import com.example.foominity.service.notice.NoticeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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

    @GetMapping("/api/notice/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<NoticeResponse> res = noticeService.findAll(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/notice/{id}")
    public ResponseEntity<NoticeResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findByID(id));
    }

    @PostMapping("/api/notice/add")
    public ResponseEntity<String> createNotice(@Valid @RequestBody NoticeRequest req) {
        noticeService.createNotice(req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/notice/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/notice/main/{id}")
    public ResponseEntity<String> changeMainNotice(@PathVariable Long id) {
        noticeService.changeMainNotice(id);
        return ResponseEntity.ok().build();
    }

}
