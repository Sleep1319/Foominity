package com.example.foominity.domain.member;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.sign.SocialType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Table(name = "member")
@NoArgsConstructor
@Getter
@ToString
@Entity
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    private String password;

    @Column(name = "user_name")
    private String userName;

    @Column(unique = true)
    private String nickname;

    @Column(name = "social_type")
    private String socialType;

    @Column(name = "provider_id")
    private String providerId;

    public Member(String email, String password, String userName, String nickname) {
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.nickname = nickname;
        socialType = "NORMAL";
        providerId = null;
    }

    // setter가 아닌 도메인 메서드 쓰는 이유
    // 닉네임 unique 라서 중복되면 안 되니까 setter 쓰면 안 됨
    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

}
