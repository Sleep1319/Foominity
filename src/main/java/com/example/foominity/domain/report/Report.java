package com.example.foominity.domain.report;

import com.example.foominity.domain.member.Member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "target_type", nullable = false)
    private String targetType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "report", cascade = CascadeType.REMOVE)
    private List<ReportComment> reportComments;

    public Report(Long targetId, String targetType, Member member) {
        this.targetId = targetId;
        this.targetType = targetType;
        this.member = member;
    }

}
