package com.example.foominity.dto.report;

import java.time.LocalDateTime;

import com.example.foominity.domain.report.Report;
import com.example.foominity.domain.report.ReportType;

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
    private String nickname;

    private ReportType type;

    private Long targetId;

    private String targetType;

    @NotNull
    private String title;

    @NotNull
    private String reason;

    @NotNull
    private String status;

    @NotNull
    private int views;

    @NotNull
    private LocalDateTime createdDate;

    public ReportResponse(Long id, ReportType type, String nickname, String title, String status, int views,
            LocalDateTime createdDate) {
        this.id = id;
        this.type = type;
        this.nickname = nickname;
        this.title = title;
        this.status = status;
        this.views = views;
        this.createdDate = createdDate;
    }

    public static ReportResponse from(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getMember().getId(),
                report.getMember().getNickname(),
                report.getType(),
                report.getTargetId(),
                report.getTargetType(),
                report.getTitle(),
                report.getReason(),
                report.getStatus().name(),
                report.getViews(),
                report.getCreatedDate());
    }

}
