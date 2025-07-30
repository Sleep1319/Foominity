package com.example.foominity.dto.comment;

import java.time.LocalDateTime;

import com.example.foominity.domain.report.ReportComment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportCommentResponse {

    private Long id;

    private String nickname;

    private String comment;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public static ReportCommentResponse fromEntity(ReportComment comment) {
        return new ReportCommentResponse(
                comment.getId(),
                comment.getNickname(),
                comment.getContent(),
                null,
                null);
    }

}
