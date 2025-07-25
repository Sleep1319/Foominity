package com.example.foominity.controller.report;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.dto.report.ReportCreateRequest;
import com.example.foominity.dto.report.ReportResponse;
import com.example.foominity.dto.report.ReportStatusUpdateRequest;
import com.example.foominity.service.report.ReportService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RequiredArgsConstructor
@RestController
public class ReportController {

    private final ReportService reportService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/api/report/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<ReportResponse> res = reportService.findAll(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/report")
    public ResponseEntity<List<ReportResponse>> findAllReports() {
        List<ReportResponse> res = reportService.findAllReports(); // 전체 조회용 서비스 메서드
        return ResponseEntity.ok(res);
    }

    // 내 report 조회
    @GetMapping("/api/report/my")
    public ResponseEntity<Page<ReportResponse>> findMyReports(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Page<ReportResponse> reports = reportService.findMyReportsPaged(memberId, page, size);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/api/report/{id}")
    public ResponseEntity<ReportResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.findById(id));
    }

    @PostMapping("/api/report/add")
    public ResponseEntity<String> createReport(@Valid @RequestBody ReportCreateRequest req,
            HttpServletRequest tokenRequest) {
        reportService.createReport(req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/report/{id}")
    public ResponseEntity<String> deleteReport(@PathVariable Long id, HttpServletRequest tokenRequest) {
        reportService.deleteReport(id, tokenRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/report/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody ReportStatusUpdateRequest req,
            HttpServletRequest tokenRequest) {
        System.out.println("==== 컨트롤러 req: " + req);
        System.out.println("==== 컨트롤러 status: " + req.getStatus());
        reportService.updateStatus(id, req.getStatus(), tokenRequest);
        return ResponseEntity.ok().build();
    }

}
