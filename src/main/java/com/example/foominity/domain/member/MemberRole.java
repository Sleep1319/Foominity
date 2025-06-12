// package com.example.foominity.domain.member;

// import com.example.foominity.domain.sign.SocialType;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.ToString;

// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// @Getter
// @ToString
// @Entity
// public class MemberRole {
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// @OneToOne
// @JoinColumn(name = "member_id")
// private Member member;

// @OneToOne
// @JoinColumn(name = "role_id")
// private Role role;

// }
