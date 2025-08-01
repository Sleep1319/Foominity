import React, { useState } from "react";
import { Text, Box } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext.jsx";
import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";

const MyMusic = () => {
  const { state } = useUser();
  // 1) 채팅 모드를 상태로 관리
  const [chatMode, setChatMode] = useState(null);

  return (
    <>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        pb={2}
        mt={4}
        ml={5}
        h="85px"
      >
        {state.nickname} 님의 음악
      </Text>

      <ParticipatedAlbums />
      <LikedAlbums />

      <Box maxW="450px" mx="auto" px={4} mt={8} mb={20}>
        {/* 2) GuidedChat에 콜백 전달 */}
        <GuidedChat onModeChange={setChatMode} />
      </Box>

      {/* 3) translate 모드를 선택했을 때만 TrackSearchWithLyrics 렌더링 */}
      {chatMode === "translate" && <TrackSearchWithLyrics />}
    </>
  );
};

export default MyMusic;
