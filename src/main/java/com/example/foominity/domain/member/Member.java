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
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(unique = true, name = "nick_name")
    private String nickName;

    private Role role;

    @Column(name = "social_type")
    private String socialType;

    @Column(name = "provider_id")
    private String providerId;

    public Member(String email, String password, String userName, String nickName, Role role) {
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.nickName = nickName;
        this.role = role;
        socialType = "NORMAL";
        providerId = null;
    }

}
