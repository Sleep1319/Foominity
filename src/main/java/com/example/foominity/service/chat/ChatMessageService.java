package com.example.foominity.service.chat;

import com.example.foominity.domain.chat.ChatMessage;
import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.repository.chat.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public void handleIncomingMessage(ChatMessageDto dto, Long memberId, String nickname) {
        ChatMessage message = new ChatMessage(
                dto.getRoomId(),
                memberId,
                dto.getMessage(),
                dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now()
        );

        chatMessageRepository.save(message);
    }
}
