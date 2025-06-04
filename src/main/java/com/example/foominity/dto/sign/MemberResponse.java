package com.example.foominity.dto.sign;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberResponse {
    private int memberId;
    private String email;
    private String username;
    private String nickname;
    private String roleName;
}
