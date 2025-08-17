package com.example.foominity.service.chat;

import com.example.foominity.domain.chat.ChatRoom;
import com.example.foominity.repository.chat.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public Long createOrFindRoom(Long memberId) {
        return chatRoomRepository.findByMemberId(memberId)
                .map(ChatRoom::getId)
                .orElseGet(() -> {
                    ChatRoom newRoom = ChatRoom.of(memberId);
                    return chatRoomRepository.save(newRoom).getId();
                });
    }

    public Long getOwnerId(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .map(ChatRoom::getMemberId)
                .orElseThrow(() -> new IllegalArgumentException("room not found"));
    }

    public Long findExistingRoomId(Long memberId) {
        return chatRoomRepository.findByMemberId(memberId)
                .map(ChatRoom::getId)
                .orElse(null);
    }
}
