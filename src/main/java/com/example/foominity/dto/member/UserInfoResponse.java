package com.example.foominity.dto.member;

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
}

