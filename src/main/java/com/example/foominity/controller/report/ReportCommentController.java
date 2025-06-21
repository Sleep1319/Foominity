package com.example.foominity.controller.report;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.dto.comment.BoardCommentUpdateRequest;
import com.example.foominity.dto.comment.ReportCommentRequest;
import com.example.foominity.dto.comment.ReportCommentResponse;
import com.example.foominity.dto.comment.ReportCommentUpdateRequest;
import com.example.foominity.service.board.BoardCommentService;
import com.example.foominity.service.board.ReviewCommentService;
import com.example.foominity.service.report.ReportCommentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ReportCommentController {

    private final ReportCommentService reportCommentService;

    @GetMapping("/api/reports/{reportId}/comments")
    public ResponseEntity<List<ReportCommentResponse>> findAll(@PathVariable Long reportId) {
        List<ReportCommentResponse> res = reportCommentService.getList(reportId);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/reports/{reportId}/comments")
    public ResponseEntity<String> createReportComment(@PathVariable Long reportId, HttpServletRequest tokenRequest,
            @Valid @RequestBody ReportCommentRequest req) {
        reportCommentService.createReportComment(reportId, tokenRequest, req);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/reports/{reportId}/comments/{id}")
    public ResponseEntity<String> updateReportComment(@PathVariable Long commentId, HttpServletRequest tokenRequest,
            @Valid @RequestBody ReportCommentUpdateRequest req) {
        reportCommentService.updateReportComment(commentId, tokenRequest, req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/reports/{reportId}/comments/{id}")
    public ResponseEntity<String> deleteReportComment(@PathVariable Long commentId,
            HttpServletRequest tokenRequest) {
        reportCommentService.deleteReportComment(commentId, tokenRequest);
        return ResponseEntity.ok().build();
    }

}
