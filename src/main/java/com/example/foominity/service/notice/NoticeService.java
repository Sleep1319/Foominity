package com.example.foominity.service.notice;

import java.util.List;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.board.ReviewResponse;
import com.example.foominity.exception.NotFoundReviewException;
import com.example.foominity.exception.UnauthorizedException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.domain.notice.Notice;
import com.example.foominity.dto.notice.NoticeRequest;
import com.example.foominity.dto.notice.NoticeResponse;
import com.example.foominity.dto.notice.NoticeUpdateRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundNoticeException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.notice.NoticeRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public Page<NoticeResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 4, Sort.by(Sort.Direction.DESC, "id"));
        Page<Notice> notices = noticeRepository.findAll(pageable);

        List<NoticeResponse> noticeResponseList = notices.stream()
                .map(notice -> new NoticeResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getContent()))
                .toList();
        return new PageImpl<>(noticeResponseList, pageable, notices.getTotalElements());
    }

    public NoticeResponse findByID(Long id) {
        Notice notice = noticeRepository.findById(id).orElseThrow(NotFoundNoticeException::new);
        return new NoticeResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getContent());
    }

    @Transactional
    public void createNotice(NoticeRequest req, HttpServletRequest Request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(Request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        noticeRepository.save(req.toEntity(req));
    }

    @Transactional
    public void deleteNotice(Long id, HttpServletRequest Request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(Request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        Notice notice = noticeRepository.findById(id).orElseThrow(NotFoundNoticeException::new);
        noticeRepository.delete(notice);

    }

    @Transactional
    public void changeMainNotice(Long newMainNoticeId, HttpServletRequest Request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(Request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        noticeRepository.findByMainNoticeTrue().ifPresent(mainNotice -> {
            mainNotice.cancelNotice();
            noticeRepository.save(mainNotice);
        });
        noticeRepository.findById(newMainNoticeId)
                .map(newMain -> {
                    newMain.changeNotice();
                    return noticeRepository.save(newMain);
                })
                .orElseThrow(NotFoundNoticeException::new);
    }

    public List<NoticeResponse> getLatest() {
        List<Notice> noticeList = noticeRepository.findTop4ByOrderByIdDesc().orElseThrow(NotFoundNoticeException::new);

        return noticeList.stream()
                .map(notice -> new NoticeResponse(
                        notice.getId(),
                        notice.getTitle()))
                .toList();
    }

}
