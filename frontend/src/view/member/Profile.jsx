import { Avatar, Box, HStack, Text, VStack, Flex, Button, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaUser, FaEnvelope, FaUserTag, FaIdBadge, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ 주석 해제
import { useUser } from "../../context/UserContext.jsx";
import DeleteModal from "../../view/Member/DeleteModal.jsx";
import MyPostsTable from "../../components/memberComponents/MyPostsTable.jsx";
import SettingsButton from "../../components/memberComponents/SettingsButton.jsx";
import MyRequests from "../../components/memberComponents/MyRequests.jsx";

const Profile = () => {
  const navigate = useNavigate(); // ✅ 사용
  const { state } = useUser();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handlePreview = () => {
    navigate(`/users/${state.memberId}/profile`);
  };

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
        마이페이지
      </Text>
      {/* 미리보기 버튼 */}
      <Button size="sm" leftIcon={<FaEye />} bg="white" color="black" ml="584px" mb="-115px" onClick={handlePreview}>
        내 프로필 미리보기
      </Button>

      <Flex maxW="3xl" mx="auto" mt={70} align="center" justify="flex-start">
        <Flex mb={6} align="center" justify="space-between" height={190}>
          <HStack spacing={6} align="center" flex="1">
            <Avatar
              boxSize="12rem"
              src={state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg"}
            />

            <VStack align="start" spacing={4}>
              <HStack>
                <Icon as={FaUser} />
                <Text fontWeight="bold" w="80px">
                  닉네임
                </Text>
                <Text h="32px" lineHeight="32px">
                  {state.nickname}
                </Text>
              </HStack>
              <HStack>
                <Icon as={FaIdBadge} />
                <Text fontWeight="bold" w="80px">
                  이름
                </Text>
                <Text>{state.username}</Text>
              </HStack>
              <HStack>
                <Icon as={FaEnvelope} />
                <Text fontWeight="bold" w="80px">
                  이메일
                </Text>
                <Text>{state.email}</Text>
              </HStack>
              <HStack>
                <Icon as={FaUserTag} />
                <Text fontWeight="bold" w="80px">
                  등급
                </Text>
                <Text>{state.roleName}</Text>
              </HStack>
            </VStack>
          </HStack>
        </Flex>

        <VStack ml={153} mr={7}>
          <SettingsButton />
        </VStack>
      </Flex>

      <Box maxW="3xl" mx="auto" px={4} mt={8} mb={20}>
        <Text fontSize={20} mb={4} fontWeight="bold">
          나의 게시물
        </Text>
        <MyPostsTable />
        <MyRequests />
      </Box>
      <DeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
};

export default Profile;
