package com.example.foominity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.Following;

public interface FollowingRepository extends JpaRepository<Following, Long> {

}