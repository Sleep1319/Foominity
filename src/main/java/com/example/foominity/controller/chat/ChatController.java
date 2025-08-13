package com.example.foominity.controller.chat;

import com.example.foominity.domain.chat.ChatMessage;
import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.repository.chat.ChatMessageRepository;
import com.example.foominity.service.chat.ChatMessageService;
import com.example.foominity.service.chat.ChatRoomService;
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
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageDto dto,
                            @Header("simpSessionAttributes") Map<String, Object> attributes) {
        Long senderId = (Long) attributes.get("memberId");
        String nickname = (String) attributes.get("nickname");
        if (senderId == null) throw new IllegalStateException("Unauthenticated");

        ChatMessageDto out = chatMessageService.handleIncomingMessage(dto, senderId, nickname);

        // 1) 방 브로드캐스트
        messagingTemplate.convertAndSend("/topic/chat/" + out.getRoomId(), out);

        // 2) 관리자 인박스
        String preview = out.getMessage();
        if (preview != null && preview.length() > 120) preview = preview.substring(0, 120) + "…";
        messagingTemplate.convertAndSend("/topic/admin/inbox", Map.of(
                "roomId", out.getRoomId(),
                "preview", preview,
                "from", out.getSenderNickname(),
                "createdAt", out.getCreatedAt()
        ));

        // 3) 유저 개인 알림 (관리자가 보낸 경우)
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
