import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
import ChatSocket from "./ChatSocket"; // 실제 메시지 기능 연결

const ChatWidget = ({ roomId, senderId }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const { sendMessage } = ChatSocket({
    roomId,
    senderId,
    onMessageReceive: (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
  });

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="1000">
      {/* 열기/닫기 토글 버튼 */}
      <IconButton
        icon={isOpen ? <CloseIcon /> : <ChatIcon />}
        onClick={onToggle}
        colorScheme="teal"
        borderRadius="full"
        aria-label="Chat Toggle"
      />

      <Collapse in={isOpen} animateOpacity>
        <Box
          mt="3"
          w="300px"
          bg="white"
          p="3"
          rounded="md"
          shadow="md"
          border="1px solid #e2e8f0"
        >
          <VStack align="stretch" spacing="3">
            <Text fontWeight="bold">💬 문의하기</Text>
            <Box
              maxH="200px"
              overflowY="auto"
              border="1px solid #ddd"
              p="2"
              rounded="md"
              bg="gray.50"
            >
              {messages.map((msg, idx) => (
                <Box key={idx} mb="1">
                  <Text fontSize="sm" fontWeight="bold">
                    🧑‍💻 {msg.nickname || msg.senderId}
                  </Text>
                  <Text fontSize="sm">{msg.message}</Text>
                </Box>
              ))}
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