package com.example.foominity.dto.sign;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetRequest {
    private String email;
    private String newPassword;
}
