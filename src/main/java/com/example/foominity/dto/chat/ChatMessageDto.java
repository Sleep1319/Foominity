package com.example.foominity.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long roomId;
    private String nickname;
    private String message;
    private LocalDateTime createdAt;
}
