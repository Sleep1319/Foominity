import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

const fmt = (iso) => (iso ? iso.replace("T", " ").slice(0, 16) : "");

export default function ChatMessageList({
                                            messages = [],
                                            me = { id: null, nickname: "" },
                                            emptyText = "메시지가 없습니다.",
                                            maxBubbleWidth = "80%",
                                            containerProps = {},
                                        }) {
    const listRef = useRef(null);  // ✅ 컨테이너 ref

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        // 컨테이너 내부 스크롤만 이동
        requestAnimationFrame(() => {
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        });
    }, [messages]);

    return (
        <Box
            ref={listRef}
            h="300px"
            overflowY="auto"
            p={2}
            bg="gray.50"
            rounded="md"
            display="flex"
            flexDirection="column"
            gap={2}
            // 스크롤바 생겨도 레이아웃 안 흔들리게(선택)
            sx={{ scrollbarGutter: "stable" }}
            {...containerProps}
        >
            {messages.length === 0 ? (
                <Text color="gray.500">{emptyText}</Text>
            ) : (
                messages.map((m, i) => {
                    const mine = me?.id != null && Number(m.senderId) === Number(me.id);
                    const name = m.senderNickname ?? (mine ? (me.nickname || "나") : `member:${m.senderId}`);
                    return (
                        <ChatBubble key={i} mine={mine} name={name} time={fmt(m.createdAt)} maxW={maxBubbleWidth}>
                            {m.message}
                        </ChatBubble>
                    );
                })
            )}
        </Box>
    );
}
