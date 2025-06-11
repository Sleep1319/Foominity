 package com.example.foominity.domain.board;

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
 private Long id;

 @Column(name = "target_id")
 private Long targetId;

 @Column(name = "target_type")
 private String targetType;

 @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
 @JoinColumn(name = "member_id")
 private Member member;
 }
