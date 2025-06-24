package com.example.foominity.service.sign;

import java.util.Optional;

import com.example.foominity.domain.member.Point;
import com.example.foominity.domain.member.Role;
import com.example.foominity.repository.member.PointRepository;
import com.example.foominity.repository.member.RoleRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.member.MemberRequest;
import com.example.foominity.dto.member.NicknameChangeRequest;
import com.example.foominity.dto.sign.SignInRequest;
import com.example.foominity.dto.sign.SignInResponse;
import com.example.foominity.dto.sign.SignUpRequest;
import com.example.foominity.exception.MemberEmailAlreadyExistsException;
import com.example.foominity.exception.MemberNicknameAlreadyExistsException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.SignInFailureException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.sign.SignRepository;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SignService {

    private final SignRepository signRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final PointRepository pointRepository;
    private final RoleRepository roleRepository;

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

    @Transactional(readOnly = true)
    public boolean existsNickname(String nickname) {
        return memberRepository.existsByNickname(nickname);
    }

    // 회원가입
    @Transactional
    public void signUp(SignUpRequest req) {
        validateSignUp(req.getEmail(), req.getNickname());

        String encodedPassword = passwordEncoder.encode(req.getPassword());
        Role defaultRole = roleRepository.findByName("BRONZE")
                .orElseThrow(() -> new RuntimeException("기본 등급 없음"));

        Member member = new Member(req.getEmail(), encodedPassword, req.getUsername(),
                req.getNickname(), defaultRole);

        signRepository.save(member);

        Point point = new Point(member);
        pointRepository.save(point);
    }

    // 로그인
    public SignInResponse signIn(SignInRequest req) {
        Member member = signRepository.findByEmail(req.getEmail()).orElseThrow(
                () -> new SignInFailureException("이메일을 다시 확인해주세요."));

        // 직접 박은 비 인코더 패스워드 변환용
        if (!member.getPassword().startsWith("$2a$")) {
            member.changePassword(passwordEncoder.encode(member.getPassword()));
        }

        validateSignInPassword(req.getPassword(), member.getPassword());

        String roleName = member.getRole().getName();
        String accessToken = jwtTokenProvider.createAccessToken(
                member.getId(),
                member.getEmail(),
                member.getUserName(),
                member.getNickname(),
                roleName);
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());

        return new SignInResponse(accessToken, refreshToken);
    }

    private void validateSignUp(String email, String nickname) {
        if (memberRepository.existsByEmail(email)) {
            throw new MemberEmailAlreadyExistsException();
        }
        if (memberRepository.existsByNickname(nickname)) {
            throw new MemberNicknameAlreadyExistsException();
        }
    }

    private void validateSignInPassword(String reqPassword, String password) {
        if (!passwordEncoder.matches(reqPassword, password)) {
            throw new SignInFailureException("비밀번호 틀림");
        }
    }

}
