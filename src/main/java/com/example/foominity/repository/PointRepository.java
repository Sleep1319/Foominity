package com.example.foominity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.Point;

public interface PointRepository extends JpaRepository<Point, Long> {

}