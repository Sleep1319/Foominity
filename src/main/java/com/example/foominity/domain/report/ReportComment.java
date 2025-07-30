package com.example.foominity.domain.report;

import com.example.foominity.domain.BaseEntity;
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

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "nickname")
    private String nickname;

    // 신고 게시판 아이디
    @JoinColumn(name = "report_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Report report;

    public ReportComment(String content, Report report, Long memberId, String nickname) {
        this.content = content;
        this.report = report;
        this.memberId = memberId;
        this.nickname = nickname;
    }

    public void changeComment(String content) {
        this.content = content;
    }

}
