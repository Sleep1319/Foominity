package com.example.foominity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

}
