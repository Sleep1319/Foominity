package com.example.foominity.service.member;

import java.util.Comparator;

import org.springframework.stereotype.Service;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;
import com.example.foominity.domain.member.Role;
import com.example.foominity.dto.member.PointResponse;
import com.example.foominity.repository.member.PointRepository;
import com.example.foominity.repository.member.RoleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service
public class RoleService {

    // private final PointRepository pointRepository;
    private final RoleRepository roleRepository;
    private final PointService pointService;

    // public int calculateTotalPoint(Point point) {
    // // 계산식은 임시
    // // 동현이형이 만든 PointService에 동일 기능하는 메서드 있을 수 있음
    // return point.getReviewCount() * 10 + point.getLikeCount();
    // }

    // 등업 메서드
    // @Transactional
    // public void updateMember(Member member) {
    // // 멤버 아이디로 회원 아이디 가져온 후 pointRepository에서 해당하는 Point 정보 담아서 point에 담기
    // Point point = pointRepository.findByMemberId(member.getId())
    // // 포인트 정보 없으면 아래, 근데 메세지 써놓긴 했는데 필요한가?
    // .orElseThrow(() -> new RuntimeException("포인트 정보 없음"));

    // // 총 포인트 계산 메서드 호출해서 totalPoint에 담기 (동현이형이 만든 걸로 수정 가능성 있음)
    // int totalPoint = calculateTotalPoint(point);

    // Role newRole = roleRepository.findAll().stream()
    // // 필터로 해당하는 토탈 포인트로 가질 수 있는 role들을 골라내고
    // .filter(role -> totalPoint >= role.getRequiredPoint())
    // // 그 중에서 가장 요구 포인트가 높은 role을 찾아서 부여하기
    // .max(Comparator.comparingInt(Role::getRequiredPoint))
    // // 메세지 써놓긴 했는데 필요한가? 2
    // .orElseThrow(() -> new RuntimeException("역할 없음"));

    // // 현재 role과 위에서 고른 role이 같지 않다면
    // if (!member.getRole().equals(newRole)) {
    // // updateRole 메서드 호출해서 등업
    // member.updateRole(newRole);
    // }
    // }

    // 수정된 메서드(혹시 몰라 위에 코드 주석 처리만 했음)
    @Transactional
    public void updateMember(Member member) {
        // 1. 포인트 조회 (totalPoint 포함된 응답 받기)
        PointResponse pointResponse = pointService.getPoint(member.getId());
        int totalPoint = pointResponse.getTotalPoint();

        // 2. 등급 조건에 맞는 Role 찾기
        // newRole에 해당하는 포인트가 가지는 가장 높은 등급 정보 담아서
        Role newRole = roleRepository.findAll().stream()
                .filter(role -> totalPoint >= role.getRequiredPoint())
                .max(Comparator.comparingInt(Role::getRequiredPoint))
                .orElseThrow(() -> new RuntimeException("적절한 역할 없음"));

        // 3. 현재 Role과 다르면 업데이트
        if (!member.getRole().equals(newRole)) {
            // 현재랑 다르니까 위에서 만든 newRole 부여
            member.updateRole(newRole);
            log.info("회원 {}의 등급이 {}로 변경되었습니다.", member.getId(), newRole.getName());
        }
    }

}
