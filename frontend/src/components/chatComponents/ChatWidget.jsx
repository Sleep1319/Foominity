import React, { useState } from "react";
import {
  Box, Button, Input, VStack,
  HStack, Text, IconButton, Collapse,
} from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
import ChatSocket, { sendMessage } from "./ChatSocket";

const ChatWidget = ({ roomId, senderId, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleReceive = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setMessages((prev) => [...prev, { senderId, message: inputText }]);
      setInputText("");
    }
  };

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
                    messages.map((msg, idx) => (
                        <Box
                            key={idx}
                            alignSelf={msg.senderId === senderId ? "flex-end" : "flex-start"}
                            maxW="80%"
                            p="2"
                            bg={msg.senderId === senderId ? "teal.100" : "gray.200"}
                            borderRadius="md"
                        >
                          <Text fontSize="xs" fontWeight="bold">
                            {msg.nickname || msg.senderId}
                          </Text>
                          <Text fontSize="sm">{msg.message}</Text>
                        </Box>
                    ))
                )}
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