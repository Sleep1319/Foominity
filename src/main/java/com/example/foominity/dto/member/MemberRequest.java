package com.example.foominity.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberRequest {
    private String nickname;
    private String password;
    private String email;
}
