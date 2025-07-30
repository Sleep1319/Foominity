package com.example.foominity.service.report;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardComment;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.report.Report;
import com.example.foominity.domain.report.ReportComment;
import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.dto.comment.BoardCommentUpdateRequest;
import com.example.foominity.dto.comment.ReportCommentRequest;
import com.example.foominity.dto.comment.ReportCommentResponse;
import com.example.foominity.dto.comment.ReportCommentUpdateRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundBoardCommentException;
import com.example.foominity.exception.NotFoundBoardException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReportCommentException;
import com.example.foominity.exception.NotFoundReportException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.report.ReportCommentRepository;
import com.example.foominity.repository.report.ReportRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Log4j2
@Service
public class ReportCommentService {

    private final ReportRepository reportRepository;
    private final ReportCommentRepository reportCommentRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // 댓글 전체 출력
    public List<ReportCommentResponse> getList(Long reportId) {
        List<ReportComment> comments = reportCommentRepository.findByReportId(reportId);

        return comments.stream()
                .map(ReportCommentResponse::fromEntity)
                .toList();
    }

    // 댓글 작성
    @Transactional
    public void createReportComment(Long reportId, HttpServletRequest tokenRequest, ReportCommentRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Report report = reportRepository.findById(reportId).orElseThrow(NotFoundReportException::new);
        reportCommentRepository.save(req.toEntity(req, report, member));
    }

    // 댓글 수정
    @Transactional
    public void updateReportComment(Long commentId, HttpServletRequest tokenRequest, ReportCommentUpdateRequest req) {
        ReportComment reportComment = validateReportCommentOwnership(commentId, tokenRequest);
        reportComment.changeComment(req.getComment());
    }

    // 댓글 삭제
    @Transactional
    public void deleteReportComment(Long commentId, HttpServletRequest tokenRequest) {
        ReportComment reportComment = validateReportCommentOwnership(commentId, tokenRequest);
        reportCommentRepository.delete(reportComment);
    }

    // 댓글 작성자 검증 메서드
    public ReportComment validateReportCommentOwnership(Long commentId, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        ReportComment reportComment = reportCommentRepository.findById(commentId)
                .orElseThrow(NotFoundReportCommentException::new);

        if (!reportComment.getMemberId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }

        return reportComment;

    }
}
