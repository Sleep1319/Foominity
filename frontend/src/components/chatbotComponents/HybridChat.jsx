import React, { useState } from "react";
import { VStack, Button, Text } from "@chakra-ui/react";
import FreeChat from "./FreeChat.jsx";
import GuidedChat from "./GuidedChat.jsx";

export default function HybridChat() {
  const [mode, setMode] = useState(null);

  if (!mode) {
    return (
      <VStack spacing={4}>
        <Text fontSize="lg">Ai 음악 비서: 원하는 모드를 선택하세요!</Text>
        <Button onClick={() => setMode("guided")}>🛠 기능별 가이드</Button>
        <Button onClick={() => setMode("freechat")}>💬 자유 대화</Button>
      </VStack>
    );
  }

  return mode === "freechat" ? <FreeChat /> : <GuidedChat />;
}
