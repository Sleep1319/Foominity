package com.example.foominity.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    private Long id;

    private Long targetId;

    private String targetType;
}
