package com.example.foominity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

}
