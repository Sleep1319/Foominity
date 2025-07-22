package com.example.foominity.dto.report;

import com.example.foominity.domain.report.ReportStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportStatusUpdateRequest {
    private ReportStatus status;

}
