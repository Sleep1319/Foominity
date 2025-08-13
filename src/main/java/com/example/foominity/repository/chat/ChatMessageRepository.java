package com.example.foominity.repository.chat;

import com.example.foominity.domain.chat.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(Long roomId);

    @Query("""
       select m from ChatMessage m
       where m.roomId = :roomId
       order by m.createdAt desc
       """)
    Page<ChatMessage> findLastMessage(@Param("roomId") Long roomId, Pageable pageable);

    Optional<ChatMessage> findTopByRoomIdOrderByCreatedAtDesc(Long roomId);
}
