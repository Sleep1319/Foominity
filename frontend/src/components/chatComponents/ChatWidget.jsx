import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Input, VStack, HStack, Text, IconButton, Collapse } from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
import { sendMessage } from "./ChatSocket";
import { useSelector } from "react-redux";

export default function ChatWidget({ roomId, senderId, isOpen, onToggle, messages }) {
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef(null);
  const myNickname = useSelector((s) => s.user.nickname);

  const handleSend = () => {
    const t = inputText.trim();
    if (!t) return;
    sendMessage(t);      // 서버 echo만 반영
    setInputText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
      <Box position="fixed" bottom="4" right="4" zIndex="9999">
        <IconButton
            icon={isOpen ? <CloseIcon /> : <ChatIcon />}
            onClick={onToggle}
            colorScheme="teal"
            borderRadius="full"
            aria-label="Chat Toggle"
            mb="2"
        />

        {/* Collapse가 언마운트하지 않게: isOpen=false여도 DOM 유지 (기본 false지만 혹시 옵션 있으면 off) */}
        <Collapse in={isOpen} animateOpacity /* unmountOnExit={false} */>
          <Box w="300px" bg="white" p="3" rounded="md" shadow="lg" border="1px solid #e2e8f0">
            <VStack align="stretch" spacing="3">
              <Text fontWeight="bold">💬 문의하기</Text>

              <Box h="300px" overflowY="auto" border="1px solid #ddd" p="2" rounded="md" bg="gray.50"
                   display="flex" flexDirection="column" gap="8px">
                {(!messages || messages.length === 0) ? (
                    <Text fontSize="sm" color="gray.400">메시지가 없습니다</Text>
                ) : (
                    messages.map((m, i) => {
                      const mine = m?.senderId === senderId;
                      const displayName = m.senderNickname || m.nickname || (mine ? myNickname : "상대");
                      return (
                          <Box key={i} alignSelf={mine ? "flex-end" : "flex-start"}
                               maxW="80%" p="2" bg={mine ? "teal.100" : "gray.200"} borderRadius="md">
                            <Text fontSize="xs" fontWeight="bold">{displayName}</Text>
                            <Text fontSize="sm">{m.message}</Text>
                          </Box>
                      );
                    })
                )}
                <div ref={bottomRef} />
              </Box>

              <HStack>
                <Input size="sm" placeholder="메시지 입력..."
                       value={inputText}
                       onChange={(e) => setInputText(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                <Button size="sm" colorScheme="teal" onClick={handleSend}>전송</Button>
              </HStack>
            </VStack>
          </Box>
        </Collapse>
      </Box>
  );
}
