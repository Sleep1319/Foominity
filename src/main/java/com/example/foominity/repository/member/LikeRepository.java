package com.example.foominity.repository.member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.board.ReviewComment;
import com.example.foominity.domain.member.Like;
import com.example.foominity.domain.member.Member;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByMemberAndReviewComment(Member member, ReviewComment reviewComment);
}
