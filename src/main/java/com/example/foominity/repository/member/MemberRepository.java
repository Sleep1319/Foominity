package com.example.foominity.repository.member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.foominity.domain.member.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    // ----------------------------------------------------------------------------------------------------

    // 아이디로 찾기
    Optional<Member> findById(int id);

    // 이메일로 찾기
    Optional<Member> findByEmail(String email);

    // 넥네임으로 찾기
    Optional<Member> findByNickname(String nickname);

}
