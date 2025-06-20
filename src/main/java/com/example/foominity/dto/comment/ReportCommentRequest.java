package com.example.foominity.dto.comment;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.report.Report;
import com.example.foominity.domain.report.ReportComment;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportCommentRequest {

    @NotBlank
    private String comment;

    public ReportComment toEntity(ReportCommentRequest req, Report report, Member member) {
        return new ReportComment(req.getComment(), report, member);
    }

}
