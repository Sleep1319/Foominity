import React, { useEffect, useRef, useState } from "react";
import {
  Box, Button, Input, VStack,
  HStack, Text, IconButton, Collapse,
} from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
import ChatSocket, { sendMessage } from "./ChatSocket";
import { useSelector } from "react-redux";

const ChatWidget = ({ roomId, senderId, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef(null);
  const myNickname = useSelector((s) => s.user.nickname);

  const handleReceive = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { senderId, senderNickname: myNickname, message: text }]);
    sendMessage(text);
    setInputText("");
  };

  // 새 메시지 오면 자동 스크롤
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

        <Collapse in={isOpen} animateOpacity>
          <Box
              w="300px"
              bg="white"
              p="3"
              rounded="md"
              shadow="lg"
              border="1px solid #e2e8f0"
          >
            {roomId && (
                <ChatSocket roomId={roomId} onMessageReceive={handleReceive} />
            )}

            <VStack align="stretch" spacing="3">
              <Text fontWeight="bold">💬 문의하기</Text>

              <Box
                  h="300px"
                  overflowY="auto"
                  border="1px solid #ddd"
                  p="2"
                  rounded="md"
                  bg="gray.50"
                  display="flex"
                  flexDirection="column"
                  gap="8px"
              >
                {messages.length === 0 ? (
                    <Text fontSize="sm" color="gray.400">
                      메시지가 없습니다
                    </Text>
                ) : (
                    messages.map((msg, idx) => {
                      const mine = msg?.senderId === senderId;
                      const displayName =
                          msg.senderNickname || msg.nickname || (mine ? myNickname : "상대");
                      return (
                          <Box
                              key={idx}
                              alignSelf={mine ? "flex-end" : "flex-start"}
                              maxW="80%"
                              p="2"
                              bg={mine ? "teal.100" : "gray.200"}
                              borderRadius="md"
                          >
                            <Text fontSize="xs" fontWeight="bold">{displayName}</Text>
                            <Text fontSize="sm">{msg.message}</Text>
                          </Box>
                      );
                    })
                )}
                <div ref={bottomRef} />
              </Box>

              <HStack>
                <Input
                    size="sm"
                    placeholder="메시지 입력..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                />
                <Button size="sm" colorScheme="teal" onClick={handleSend}>
                  전송
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Collapse>
      </Box>
  );
};

export default ChatWidget;
