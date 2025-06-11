package com.example.foominity.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberRequest {
    private String nickname;
    private String password;
    private String email;
}
