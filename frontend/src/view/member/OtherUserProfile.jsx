// src/pages/OtherUserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Avatar, Text, VStack, HStack, Flex, Spinner, Center, Icon } from "@chakra-ui/react";
import axios from "axios";
import { FaUser, FaUserTag, FaGlobe } from "react-icons/fa";

const OtherUserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/users/${id}/profile`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("유저 정보 불러오기 실패", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!profile) {
    return (
      <Center mt={20}>
        <Text>유저 정보를 불러올 수 없습니다.</Text>
      </Center>
    );
  }

  const avatarUrl = profile.avatar ? `http://localhost:8084${profile.avatar}` : "/src/assets/images/defaultProfile.jpg";

  return (
    <Box maxW="3xl" mx="auto" mt={12} p={6}>
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
        {profile.nickname}님의 프로필
      </Text>

      <Flex maxW="3xl" mx="auto" mt={70} align="center" justify="flex-start">
        <Flex mb={6} align="center" justify="space-between" height={190}>
          <HStack spacing={6} align="center" flex="1" mt="-80px">
            <Avatar boxSize="12rem" src={avatarUrl} />

            <VStack align="start" spacing={4}>
              <HStack>
                <Icon as={FaUser} />
                <Text fontWeight="bold" w="80px">
                  닉네임
                </Text>
                <Text h="32px" lineHeight="32px">
                  {profile.nickname}
                </Text>
              </HStack>

              <HStack>
                <Icon as={FaUserTag} />
                <Text fontWeight="bold" w="80px">
                  등급
                </Text>
                <Text>{profile.roleName}</Text>
              </HStack>

              {profile.socialType && (
                <HStack>
                  <Icon as={FaGlobe} />
                  <Text fontWeight="bold" w="80px">
                    소셜
                  </Text>
                  <Text>{profile.socialType}</Text>
                </HStack>
              )}
            </VStack>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default OtherUserProfile;
