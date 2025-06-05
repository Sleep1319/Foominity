package com.example.foominity.controller.notice;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.service.notice.NoticeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@RequiredArgsConstructor
@RestController
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/api/notice/{id}")
    public ResponseEntity<?> getMethodName(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findByID(id));
    }

}
