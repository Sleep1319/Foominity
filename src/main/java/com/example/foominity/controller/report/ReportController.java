package com.example.foominity.controller.report;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.report.ReportCreateRequest;
import com.example.foominity.dto.report.ReportResponse;
import com.example.foominity.service.report.ReportService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RequiredArgsConstructor
@RestController
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/api/report/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<ReportResponse> res = reportService.findAll(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/report/{id}")
    public ResponseEntity<ReportResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.findById(id));
    }

    @PostMapping("/api/report/add")
    public ResponseEntity<String> createReport(@Valid @RequestBody ReportCreateRequest req) {
        reportService.createReport(req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/report/{id}")
    public ResponseEntity<String> deleteReport(@PathVariable Long id, HttpServletRequest tokenRequest) {
        reportService.deleteReport(id, tokenRequest);
        return ResponseEntity.ok().build();
    }

}
