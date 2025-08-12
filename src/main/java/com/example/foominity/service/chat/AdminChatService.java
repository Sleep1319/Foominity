package com.example.foominity.service.chat;

import com.example.foominity.domain.chat.ChatMessage;
import com.example.foominity.domain.chat.ChatRoom;
import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.dto.chat.ChatRoomSummaryResponse;
import com.example.foominity.repository.chat.ChatMessageRepository;
import com.example.foominity.repository.chat.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    public List<ChatRoomSummaryResponse> getRooms() {
        List<ChatRoom> rooms = chatRoomRepository.findAll();
        return rooms.stream()
                .map(r -> {
                    ChatMessage last = chatMessageRepository
                            .findTopByRoomIdOrderByCreatedAtDesc(r.getId())
                            .orElse(null);
                    return new ChatRoomSummaryResponse(
                            r.getId(),
                            r.getMemberId(),
                            last != null ? last.getMessage() : "",
                            last != null ? last.getCreatedAt() : null
                    );
                })
                .toList();
    }

    public List<ChatMessageDto> getMessages(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId)
                .stream()
                .map(m -> new ChatMessageDto(
                        m.getRoomId(),
                        m.getMemberId(),     // senderId
                        null,                // senderNickname (실시간 브로드캐스트에 포함됨)
                        m.getMessage(),
                        m.getCreatedAt()
                ))
                .toList();
    }
}
