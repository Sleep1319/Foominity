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
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.report.Report;
import com.example.foominity.domain.report.ReportStatus;
import com.example.foominity.dto.report.ReportCreateRequest;
import com.example.foominity.dto.report.ReportResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReportException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.report.ReportRepository;
import com.example.foominity.service.image.ImageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ImageService imageService;

    // 이미지 업로드 제한(개수/총용량)
    private static final int MAX_IMAGES = 10;
    private static final long MAX_TOTAL_BYTES = 20L * 1024 * 1024;

    // 전체 신고 목록
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
                        report.getCreatedDate(),
                        null))
                .toList();
        return new PageImpl<>(reportRequestList, pageable,
                reports.getTotalElements());
    }

    // 상세 조회
    @Transactional(readOnly = false)
    public ReportResponse findById(Long id) {
        Report report = reportRepository.findWithImagesById(id)
                .orElseThrow(NotFoundReportException::new);

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
                report.getCreatedDate(),
                report.getImagePaths());

    }

    // 신고 생성
    @Transactional
    public void createReport(ReportCreateRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        if (!jwtTokenProvider.validateToken(token))
            throw new UnauthorizedException();

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Report report = req.toEntity(member.getId(), member.getNickname());

        // 1) 업로드 파일 검증
        var files = req.getImages();
        if (files != null && !files.isEmpty()) {
            if (files.size() > MAX_IMAGES) {
                throw new IllegalArgumentException("이미지는 최대 " + MAX_IMAGES + "장까지 첨부할 수 있습니다.");
            }
            long total = files.stream().mapToLong(f -> f != null ? f.getSize() : 0L).sum();
            if (total > MAX_TOTAL_BYTES) {
                throw new IllegalArgumentException("이미지 총 용량은 20MB를 초과할 수 없습니다.");
            }
        }

        // 2) 새로 업로드된 파일 저장
        if (files != null) {
            for (var f : files) {
                if (f == null || f.isEmpty())
                    continue;
                ImageFile saved = imageService.imageUpload(f);
                report.getImages().add(saved);
            }
        }

        // 3) 기존 경로/외부 URL 추가
        var paths = req.getImagePaths();
        if (paths != null) {
            for (String p : paths) {
                if (p == null || p.isBlank())
                    continue;
                ImageFile img;
                if (isUrl(p)) {

                    img = imageService.downloadAndSaveFromUrl(p);
                } else {

                    img = imageService.getImageByPath(p);
                }
                report.getImages().add(img);
            }
        }

        reportRepository.save(report);
    }

    // 문자열이 외부 URL인지 판별
    private boolean isUrl(String s) {
        if (s == null)
            return false;
        String lower = s.toLowerCase();
        return lower.startsWith("http://") || lower.startsWith("https://");
    }

    // 신고 삭제(관리자 전용)
    @Transactional
    public void deleteReport(Long id, HttpServletRequest tokenRequest) {
      
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        if (member.getRole() == null || !"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        Report report = reportRepository.findById(id)
                .orElseThrow(NotFoundReportException::new);

        report.getImages().forEach(imageService::deleteImageFile);
        reportRepository.delete(report);
    }

    // 전체 신고 목록
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
                        report.getCreatedDate(),
                        null))
                .toList();
    }

    // 처리 상태 변경(관리자 전용)
    @Transactional
    public void updateStatus(Long id, ReportStatus status, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

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
                        report.getCreatedDate(),
                        null))
                .toList();
        return new PageImpl<>(responses, pageable, pageResult.getTotalElements());
    }

}
