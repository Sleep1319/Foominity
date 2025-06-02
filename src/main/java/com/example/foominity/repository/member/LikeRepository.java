package com.example.foominity.repository.member;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.member.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {

}
