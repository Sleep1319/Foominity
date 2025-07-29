package com.example.foominity.service.report;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.report.Report;
import com.example.foominity.domain.report.ReportStatus;
import com.example.foominity.dto.report.ReportCreateRequest;
import com.example.foominity.dto.report.ReportResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReportException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.BoardCommentRepository;
import com.example.foominity.repository.board.BoardRepository;
import com.example.foominity.repository.board.ReviewCommentRepository;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.report.ReportCommentRepository;
import com.example.foominity.repository.report.ReportRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public Page<ReportResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC,
                "id"));
        Page<Report> reports = reportRepository.findAll(pageable);

        List<ReportResponse> reportRequestList = reports.stream()
                .map(report -> new ReportResponse(
                        report.getId(),
                        report.getMemberId(),
                        report.getNickname(),
                        report.getType(),
                        report.getTargetId(),
                        report.getTargetType(),
                        report.getTitle(),
                        report.getReason(),
                        report.getStatus().name(),
                        report.getViews(),
                        report.getCreatedDate()))
                .toList();
        return new PageImpl<>(reportRequestList, pageable,
                reports.getTotalElements());
    }

    // public ReportResponse findById(Long id) {
    // Report report =
    // reportRepository.findById(id).orElseThrow(NotFoundReportException::new);
    // return new ReportResponse(
    // report.getId(),
    // report.getMember().getId(),
    // report.getMember().getNickname(),
    // report.getTargetId(),
    // report.getTargetType(),
    // report.getTitle(),
    // report.getReason(),
    // report.getStatus().name(),
    // report.getViews(),
    // report.getCreatedDate());
    // }

    @Transactional(readOnly = false) // 조회수 증가를 위해 추가
    public ReportResponse findById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(NotFoundReportException::new);

        report.increaseViews();
        reportRepository.save(report);
        return new ReportResponse(
                report.getId(),
                report.getMemberId(),
                report.getNickname(),
                report.getType(),
                report.getTargetId(),
                report.getTargetType(),
                report.getTitle(),
                report.getReason(),
                report.getStatus().name(),
                report.getViews(),
                report.getCreatedDate());

    }

    @Transactional
    public void createReport(ReportCreateRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        reportRepository.save(req.toEntity(member));

    }

    @Transactional
    public void deleteReport(Long id, HttpServletRequest tokenRequest) {
        Report report = validateReportOwnership(id, tokenRequest);
        reportRepository.delete(report);
    }

    public List<ReportResponse> findAllReports() {
        List<Report> reports = reportRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return reports.stream()
                .map(report -> new ReportResponse(
                        report.getId(),
                        report.getMemberId(),
                        report.getNickname(),
                        report.getType(),
                        report.getTargetId(),
                        report.getTargetType(),
                        report.getTitle(),
                        report.getReason(),
                        report.getStatus().name(),
                        report.getViews(),
                        report.getCreatedDate()))
                .toList();
    }

    @Transactional
    public void updateStatus(Long id, ReportStatus status, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 관리자 권한이 아니면 예외 발생 (roleName == "ADMIN")
        if (member.getRole() == null || !"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        Report report = reportRepository.findById(id).orElseThrow(NotFoundReportException::new);

        report.updateStatus(status);
        reportRepository.save(report);
    }

    // 권한 검증용
    public Report validateReportOwnership(Long id, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Report report = reportRepository.findById(id).orElseThrow(NotFoundReportException::new);

        if (!report.getMemberId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }
        return report;
    }

    // 내 report 조회
    public Page<ReportResponse> findMyReportsPaged(Long memberId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Report> pageResult = reportRepository.findByMemberId(memberId, pageable);
        List<ReportResponse> responses = pageResult.getContent().stream()
                .map(report -> new ReportResponse(
                        report.getId(),
                        report.getMemberId(),
                        report.getNickname(),
                        report.getType(),
                        report.getTargetId(),
                        report.getTargetType(),
                        report.getTitle(),
                        report.getReason(),
                        report.getStatus().name(),
                        report.getViews(),
                        report.getCreatedDate()))
                .toList();
        return new PageImpl<>(responses, pageable, pageResult.getTotalElements());
    }

}
