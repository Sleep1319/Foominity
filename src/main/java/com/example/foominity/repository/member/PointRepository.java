package com.example.foominity.repository.member;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {

    Optional<Point> findByMemberId(Long memberId);

}