import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { Box, VStack, HStack, Input, IconButton, Avatar, Text, Spinner, Button } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useUser } from "@/redux/useUser.js";

const menuItems = [
  { label: "1. 플레이리스트 추천", key: "recommend" },
  { label: "2. 유사곡 추천(미완)", key: "notyet" },
  { label: "3. 가사 번역", key: "translate" },
];

// 가사 포맷팅 함수
function prettifyLyrics(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/([.!?])(\s+|$)/g, "$1\n"))
    .join("\n")
    .replace(/\n{2,}/g, "\n\n");
}

const GuidedChat = forwardRef(function GuidedChat({ onModeChange }, ref) {
  const [messages, setMessages] = useState([{ sender: "BOT", content: "안녕하세요! 원하는 기능을 선택해주세요:" }]);
  const [mode, setMode] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();
  const { state } = useUser();

  const push = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  useImperativeHandle(ref, () => ({ push }), [push]);

  const handleMenuClick = (item) => {
    push({ sender: "USER", content: item.label });
    setMode(item.key);
    onModeChange(item.key);

    const prompts = {
      recommend: "플레이리스트 추천을 선택하셨습니다. 오른쪽 화면에서 질문에 답해주세요!",
      diagnosis: "진단할 노래 제목과 아티스트를 알려주세요.",
      translate: "번역할 가사를 입력해주세요.",
    };
    push({ sender: "BOT", content: prompts[item.key] });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    push({ sender: "USER", content: input });
    setLoading(true);
    try {
      const { data } = await axios.post("/api/chat", {
        message: input,
        mode,
      });
      const reply = mode === "translate" ? prettifyLyrics(data.reply) : data.reply;
      push({ sender: "BOT", content: reply });
    } catch {
      push({ sender: "BOT", content: "죄송합니다. 오류가 발생했어요." });
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} h="600px" display="flex" flexDirection="column">
      {/* 대화 내역 */}
      <VStack spacing={3} flexGrow={1} overflowY="auto" mb={4} align="stretch">
        {messages.map((m, i) => (
          <HStack key={i} justify={m.sender === "USER" ? "flex-end" : "flex-start"} align="flex-start" spacing={3}>
            {m.sender === "BOT" && (
              <Avatar
                size="md"
                name="DoremiSOL"
                border="1px solid gray"
                src="/src/assets/images/doremisolChatProfile.png"
              />
            )}
            <Box bg={m.sender === "USER" ? "blue.100" : "gray.100"} p={3} borderRadius="md" maxW="70%">
              <Text whiteSpace="pre-wrap">{m.content}</Text>
            </Box>
            {m.sender === "USER" && (
              <Avatar
                size="md"
                name="You"
                border="1px solid gray"
                src={state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg"}
              />
            )}
          </HStack>
        ))}
        {loading && <Spinner alignSelf="center" />}
        <div ref={endRef} />
      </VStack>

      {/* 0단계: 메뉴 선택 */}
      {!mode && (
        <HStack spacing={4}>
          {menuItems.map((item) => (
            <Button key={item.key} onClick={() => handleMenuClick(item)} flex={1}>
              {item.label}
            </Button>
          ))}
        </HStack>
      )}

      {/* 2,3번 모드: 텍스트 입력 */}
      {(mode === "diagnosis" || mode === "translate") && (
        <HStack>
          <Input
            placeholder="여기에 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            isDisabled={loading}
          />
          <IconButton icon={<ArrowRightIcon />} aria-label="Send" onClick={handleSend} isLoading={loading} />
        </HStack>
      )}
    </Box>
  );
});

export default GuidedChat;
