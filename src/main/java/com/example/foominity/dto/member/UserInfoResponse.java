package com.example.foominity.dto.member;

import java.nio.file.Paths;

import com.example.foominity.domain.member.Member;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInfoResponse {
    private Long memberId;
    private String email;
    private String username;
    private String nickname;
    private String roleName;
    private String avatar;

    // 추가(컨트롤러 주석부분이랑)
    public UserInfoResponse(Member member) {
        this.memberId = member.getId();
        this.email = member.getEmail();
        this.username = member.getUserName();
        this.nickname = member.getNickname();
        this.roleName = member.getRole().getName();
        this.avatar = member.getProfileImage() != null
                ? "/uploads/" + Paths.get(member.getProfileImage().getSavePath()).getFileName().toString()
                : null;
    }

}
