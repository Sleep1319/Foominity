package com.example.foominity.repository.sign;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.member.Member;

import java.util.Optional;

@Repository
public interface SignRepository extends JpaRepository<Member, Long> {

    // 기능 구현 후 참고 및 사용

    Optional<Member> findById(int id);

    // 이메일로 찾기
    public Optional<Member> findByEmail(String email);

    // 넥네임으로 찾기
    public Optional<Member> findByNickname(String nickname);

}
