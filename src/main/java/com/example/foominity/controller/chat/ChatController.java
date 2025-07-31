package com.example.foominity.controller.chat;

import com.example.foominity.domain.chat.ChatMessage;
import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.repository.chat.ChatMessageRepository;
import com.example.foominity.service.chat.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageDto dto) {

chatMessageService.handleIncomingMessage(dto);

        // 메시지를 /topic/chat/{roomId} 구독자에게 전송
        messagingTemplate.convertAndSend(
                "/topic/chat/" + dto.getRoomId(),
                dto
        );
    }
}
