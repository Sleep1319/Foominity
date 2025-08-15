package com.example.foominity.repository.report;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.report.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findAll(Pageable pageable);

    Optional<Report> findById(Long id);

    // List<Report> findByMemberIdOrderByIdDesc(Long memberId);

    Page<Report> findByMemberId(Long memberId, Pageable pageable);

    // 신고와 연관된 이미지까지 한 번에 로딩해서 조회
    @EntityGraph(attributePaths = "images")
    Optional<Report> findWithImagesById(Long id);
}
