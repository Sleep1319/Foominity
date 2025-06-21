package com.example.foominity.repository.report;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.foominity.domain.report.ReportComment;

@Repository
public interface ReportCommentRepository extends JpaRepository<ReportComment, Long> {

    List<ReportComment> findByReportId(Long id);
}
