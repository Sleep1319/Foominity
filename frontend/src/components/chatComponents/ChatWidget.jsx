import React, { useState } from "react";
import { Box, Button, Input, VStack, HStack, Text, IconButton, Collapse } from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
import { sendMessage } from "./ChatSocket";
import { useSelector } from "react-redux";
import ChatMessageList from "./ChatMessageList";

export default function ChatWidget({ roomId, senderId, isOpen, onToggle, messages }) {
  const [inputText, setInputText] = useState("");
  const myNickname = useSelector((s) => s.user.nickname);

  const handleSend = () => {
    const t = inputText.trim();
    if (!t) return;
    sendMessage(t); // 서버 echo만 반영
    setInputText("");
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
          <Box w="300px" bg="white" p="3" rounded="md" shadow="lg" border="1px solid #e2e8f0">
            <VStack align="stretch" spacing="3">
              <Text fontWeight="bold">💬 문의하기</Text>

              <ChatMessageList
                  messages={messages}
                  me={{ id: senderId, nickname: myNickname }}
                  emptyText="메시지가 없습니다"
                  maxBubbleWidth="80%"
                  containerProps={{ h: "300px", border: "1px solid #ddd" }}
              />

              <HStack>
                <Input
                    size="sm"
                    placeholder="메시지 입력..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="sm" colorScheme="teal" onClick={handleSend}>전송</Button>
              </HStack>
            </VStack>
          </Box>
        </Collapse>
      </Box>
  );
}