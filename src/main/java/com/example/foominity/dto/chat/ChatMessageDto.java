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
    private Long senderId;
    private String senderNickname;
    private String message;
    private LocalDateTime createdAt;
}
