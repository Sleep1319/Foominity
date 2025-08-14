package com.example.foominity.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ChatRoomSummaryResponse {
    private Long roomId;
    private Long memberId;
    private String senderNickname;
    private String lastMessage;
    private LocalDateTime lastAt;
}
