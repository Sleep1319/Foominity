package com.example.foominity.controller.chat;

import com.example.foominity.domain.chat.ChatMessage;
import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.repository.chat.ChatMessageRepository;
import com.example.foominity.service.chat.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;


@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageDto dto,
                            @Header("simpSessionAttributes") Map<String, Object> attributes) {

        Long memberId = (Long) attributes.get("memberId");
        String nickname = (String) attributes.get("nickname");

        // 메시지 처리 (DB 저장 등)
        chatMessageService.handleIncomingMessage(dto, memberId, nickname);

        // 구독자에게 메시지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/chat/" + dto.getRoomId(), dto);
    }
}
