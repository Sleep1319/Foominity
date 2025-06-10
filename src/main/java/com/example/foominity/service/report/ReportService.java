package com.example.foominity.service.report;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.report.Report;
import com.example.foominity.dto.report.ReportCreateRequest;
import com.example.foominity.dto.report.ReportResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReportException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.report.ReportRepository;

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
        PageRequest pageable = PageRequest.of(page, 4, Sort.by(Sort.Direction.DESC,
                "id"));
        Page<Report> reports = reportRepository.findAll(pageable);

        List<ReportResponse> reportRequestList = reports.stream()
                .map(report -> new ReportResponse(
                        report.getId(),
                        report.getMember().getId(),
                        report.getTargetId(),
                        report.getTargetType()))
                .toList();
        return new PageImpl<>(reportRequestList, pageable,
                reports.getTotalElements());
    }

    public ReportResponse findById(Long id) {
        Report report = reportRepository.findById(id).orElseThrow(NotFoundReportException::new);
        return new ReportResponse(
                report.getId(),
                report.getMember().getId(),
                report.getTargetId(),
                report.getTargetType());
    }

    @Transactional
    public void createReport(ReportCreateRequest req) {
        Member member = memberRepository.findById(req.getMemberId()).orElseThrow(NotFoundMemberException::new);
        Report report = req.toEntity(req, member);
        reportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Long id, HttpServletRequest tokenRequest) {
        Report report = validateReportOwnership(id, tokenRequest);
        reportRepository.delete(report);
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

        if (!report.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }
        return report;
    }
}
