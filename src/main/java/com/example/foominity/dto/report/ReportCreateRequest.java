package com.example.foominity.dto.report;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.report.Report;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportCreateRequest {

    @NotNull
    private Long memberId;

    @NotNull
    private Long targetId;

    @NotNull
    private String targetType;

    public Report toEntity(ReportCreateRequest req, Member member) {
        return new Report(req.getTargetId(), req.getTargetType(), member);
    }
}
