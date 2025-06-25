package com.example.foominity.domain.report;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@Getter
@Entity
public class ReportComment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    // 신고 게시판 아이디
    @JoinColumn(name = "report_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Report report;

    public ReportComment(String content, Report report, Member member) {
        this.content = content;
        this.report = report;
        this.member = member;
    }

    public void changeComment(String content) {
        this.content = content;
    }

}
