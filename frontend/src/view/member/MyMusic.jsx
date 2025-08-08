import { Avatar, Box, HStack, Text, VStack, Flex, Button, Input } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext.jsx";
import axios from "axios";
import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
import RecommendedAlbums from "../../components/memberComponents/RecommendAlbums.jsx";
axios.defaults.baseURL = "http://localhost:8084"; // 기본 백엔드 주소
axios.defaults.withCredentials = true;

const MyMusic = () => {
  const { state } = useUser();

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
      >
        {state.nickname} 님의 음악
      </Text>

      <ParticipatedAlbums />
      <LikedAlbums />
      <RecommendedAlbums />
    </>
  );
};

export default MyMusic;
