package com.example.foominity.dto.notice;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.notice.Notice;
import com.example.foominity.domain.report.Report;
import com.example.foominity.dto.report.ReportCreateRequest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeCreateRequest {

    @NotNull
    private String title;

    @NotNull
    private String content;

    public Notice toEntity(NoticeCreateRequest req, Member member) {
        return new Notice(req.getTitle(), req.getContent(), member);
    }

}
