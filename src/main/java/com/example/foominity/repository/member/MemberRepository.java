package com.example.foominity.repository.member;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.member.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

}
