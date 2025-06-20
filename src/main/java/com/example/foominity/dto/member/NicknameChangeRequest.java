package com.example.foominity.dto.member;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NicknameChangeRequest {

    @NotBlank
    private String nickname;
}
