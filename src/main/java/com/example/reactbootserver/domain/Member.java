package com.example.reactbootserver.domain;

import com.example.reactbootserver.domain.enumPackage.Role;
import com.example.reactbootserver.domain.enumPackage.SocialType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(unique = true)
    private String email;

    private String password;

    private String username;

    @Column(unique = true)
    private String nickname;

    @Enumerated
    private Role role;

    @Enumerated
    private SocialType socialType;

    private String providerId;

    public Member(String email, String password, String username, String nickname, Role role, SocialType socialType, String providerId) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.nickname = nickname;
        this.role = role;
        this.socialType = socialType;
        this.providerId = providerId;
    }

    // 비밀번호 변경
    public void changePassword(String password) {
        this.password = password;
    }

}
