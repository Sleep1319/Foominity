package com.example.foominity.dto.sign;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialSignUpRequest {
    private String email;
    private String username;
    private String nickname;
    private String socialType;
    private String providerId;
}
