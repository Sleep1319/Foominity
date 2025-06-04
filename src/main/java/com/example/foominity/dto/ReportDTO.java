package com.example.foominity.dto;

import java.time.LocalDateTime;

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

}
