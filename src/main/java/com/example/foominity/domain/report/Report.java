package com.example.foominity.domain.report;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.member.Member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Report extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "target_type")
    private String targetType;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReportType type;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(nullable = false, columnDefinition = "int default 0")
    private int views;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "report", cascade = CascadeType.REMOVE)
    private List<ReportComment> reportComments;

    public Report(String title, String reason, ReportType type, Long targetId, String targetType, Member member) {
        this.title = title;
        this.reason = reason;
        this.type = type;
        this.targetId = targetId;
        this.targetType = targetType;
        this.member = member;
        this.status = ReportStatus.PENDING;
        this.views = 0;
    }

    public void updateStatus(ReportStatus status) {
        this.status = status;
    }

    public void increaseViews() {
        this.views++;
        System.out.println("[DEBUG] 조회수 증가: 현재 views = " + this.views);
    }

}
