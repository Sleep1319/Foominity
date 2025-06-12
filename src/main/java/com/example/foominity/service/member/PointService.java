package com.example.foominity.service.member;

import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;
import com.example.foominity.dto.member.PointResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundPointException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.PointRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service
public class PointService {

    private final PointRepository pointRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // public PointResponse getPoint(Point point) {
    // int totalPoint = calPoint(point);
    // return new PointResponse(point.getId(), totalPoint);
    // }

    // 포인트 조회
    public PointResponse getPoint(Long memberId) {
        memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Optional<Point> point = pointRepository.findByMemberId(memberId);

        int totalPoint = point.map(this::calPoint).orElse(0);

        return new PointResponse(memberId, totalPoint);
    }

    // 포인트 초기화
    @Transactional
    public void resetPoint(Long memberId) {
        memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Optional<Point> point = pointRepository.findByMemberId(memberId);

        point.ifPresent(Point::resetPoint);

    }

    @Transactional
    public void updateReviewCount(Long memberId) {
        Point point = pointRepository.findByMemberId(memberId).orElseThrow(NotFoundPointException::new);

        point.addReviewCount();
    }

    @Transactional
    public void updateLikeCount(Long memberId) {
        Point point = pointRepository.findByMemberId(memberId).orElseThrow(NotFoundPointException::new);

        point.addLikeCount();
    }

    private int calPoint(Point point) {
        return (point.getReviewCount() * 10) + (point.getLikeCount() * 2);
    }

}
