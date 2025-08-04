import React, { useState, useEffect, useRef } from "react";
import { Box, VStack, HStack, Input, IconButton, Avatar, Text, Spinner } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import axios from "axios";

const FreeChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "USER", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/chat", { message: input });
      const botMsg = { sender: "BOT", content: data.reply };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [...msgs, { sender: "BOT", content: "난 음악 얘기만 한다." }]);
    }
    setLoading(false);
  };

  // 스크롤 맨 아래로
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} h="600px" display="flex" flexDirection="column">
      <VStack spacing={3} flexGrow={1} overflowY="auto" mb={4} align="stretch">
        {messages.map((msg, idx) => (
          <HStack key={idx} justify={msg.sender === "USER" ? "flex-end" : "flex-start"}>
            {msg.sender === "BOT" && <Avatar size="sm" name="HarmoniAI" />}
            <Box bg={msg.sender === "USER" ? "blue.100" : "gray.100"} p={3} borderRadius="md" maxW="70%">
              <Text whiteSpace="pre-wrap">{msg.content}</Text>
            </Box>
            {msg.sender === "USER" && <Avatar size="sm" name="You" />}
          </HStack>
        ))}
        {loading && <Spinner alignSelf="center" />}
        <div ref={endRef} />
      </VStack>
      <HStack>
        <Input
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton icon={<ArrowRightIcon />} aria-label="Send" onClick={sendMessage} isLoading={loading} />
      </HStack>
    </Box>
  );
};

export default FreeChat;
