package com.example.foominity.domain.report;

import com.example.foominity.domain.member.Member;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

}
