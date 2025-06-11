package com.example.foominity.dto.report;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    @NotNull
    private Long id;

    @NotNull
    private Long memberId;

    @NotNull
    private Long targetId;

    @NotNull
    private String targetType;
}
