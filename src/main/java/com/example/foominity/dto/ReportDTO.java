package com.example.foominity.dto;

import java.time.LocalDateTime;

import com.example.foominity.domain.board.Report;
import com.example.foominity.dto.report.ReportResponse;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ReportDTO {

    private Long id;

    private Long memberId;

    private Long targetId;

    private String targetType;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

//     public Report toEntity(Long id, Long memberId, Long targetId, String
//     targetType) {
//     return new Report(
//     id,
//     memberId,
//     targetId,
//     targetType
//     );
// }
}
