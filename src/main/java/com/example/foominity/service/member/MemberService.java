package com.example.foominity.service.member;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.member.MemberRequest;
import com.example.foominity.dto.member.NicknameChangeRequest;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.member.MemberRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원 탈퇴
    @Transactional
    public void deleteMember(HttpServletRequest tokenRequest, MemberRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 비밀번호 일치 확인
        if (!passwordEncoder.matches(req.getPassword(), member.getPassword())) {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        } else {
            memberRepository.delete(member);
        }
    }

    // 닉네임 변경
    @Transactional
    public void changeNickname(HttpServletRequest tokenRequest, NicknameChangeRequest req) {

        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        if (memberRepository.existsByNickname(req.getNickname())) {
            throw new IllegalStateException("이미 사용 중인 닉네임입니다.");
        }
        member.changeNickname(req.getNickname());
    }
}
