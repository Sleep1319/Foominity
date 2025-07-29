import { Avatar, Box, HStack, Text, VStack, Flex, Button, Input } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext.jsx";
import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
import OtherUserLikedAlbums from "../../components/memberComponents/PublicProfileLikedAlbums.jsx";

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
        h="85px"
      >
        {/* {state.nickname} 님의 음악 */}
      </Text>
      <Text ml="21px" mt="5px" fontWeight="semibold" fontSize=" xl">
        {state.nickname} 님의 음악
      </Text>

      <ParticipatedAlbums />
      <LikedAlbums />
    </>
  );
};

export default MyMusic;
