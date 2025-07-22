package com.example.foominity.dto.report;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.report.Report;
import com.example.foominity.domain.report.ReportType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportCreateRequest {

    @NotNull
    private ReportType type;

    private Long targetId;

    private String targetType;

    @NotBlank
    private String title;

    @NotBlank
    private String reason;

    public Report toEntity(Member member) {
        return new Report(this.title, this.reason, this.type, this.targetId, this.targetType, member);
    }
}
