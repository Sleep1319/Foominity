package com.example.foominity.controller.chat;

import com.example.foominity.domain.chat.ChatMessage;
import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.repository.chat.ChatMessageRepository;
import com.example.foominity.service.chat.ChatMessageService;
import com.example.foominity.service.chat.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageDto dto,
                            @Header("simpSessionAttributes") Map<String, Object> attributes) {
        log.info("[WS IN] dto={}, attrs={}", dto, attributes);
        Long senderId = (Long) attributes.get("memberId");
        String nickname = (String) attributes.get("nickname");
        if (senderId == null) throw new IllegalStateException("Unauthenticated");

        ChatMessageDto out = chatMessageService.handleIncomingMessage(dto, senderId, nickname);

        messagingTemplate.convertAndSend("/topic/chat/" + out.getRoomId(), out);

        String preview = out.getMessage();
        if (preview != null && preview.length() > 120) preview = preview.substring(0, 120) + "…";
        messagingTemplate.convertAndSend("/topic/admin/inbox", Map.of(
                "roomId", out.getRoomId(),
                "preview", preview,
                "from", out.getSenderNickname(),
                "createdAt", out.getCreatedAt()
        ));

        Long roomOwnerId = chatRoomService.getOwnerId(out.getRoomId());
        if (!senderId.equals(roomOwnerId)) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(roomOwnerId),
                    "/queue/inbox",
                    Map.of(
                            "roomId", out.getRoomId(),
                            "preview", preview,
                            "from", out.getSenderNickname(),
                            "createdAt", out.getCreatedAt()
                    )
            );
        }
    }
}
