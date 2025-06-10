package com.example.foominity.service.report;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.domain.board.Report;
import com.example.foominity.dto.report.ReportResponse;
import com.example.foominity.repository.report.ReportRepository;

@Transactional(readOnly = true)
@Service
public class ReportService {

    // private final ReportRepository reportRepository;

    // public Page<ReportResponse> findAll(int page) {
    // PageRequest pageable = PageRequest.of(page, 4, Sort.by(Sort.Direction.DESC,
    // "id"));
    // Page<Report> reports = reportRepository.findAll(pageable);

    // List<ReportResponse> reportRequestList = reports.stream()
    // .map(report -> new ReportResponse(
    // report.getTargetId(),
    // report.getTargetType(),
    // report.getId()
    // ))
    // .toList();
    // return new PageImpl<>(reportRequestList, pageable,
    // reports.getTotalElements());
    // }
}
