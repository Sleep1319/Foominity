import { Avatar, Box, HStack, Text, VStack, Flex, Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import DeleteModal from "../../view/Member/DeleteModal.jsx";
import axios from "axios";
import MyPostsTable from "../../components/memberComponents/MyPostsTable.jsx";
import SettingsButton from "../../components/memberComponents/SettingsButton.jsx";
axios.defaults.baseURL = "http://localhost:8084"; // 기본 백엔드 주소
axios.defaults.withCredentials = true;

const Profile = () => {
  // const navigate = useNavigate();
  const { state } = useUser();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

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

      <Flex maxW="3xl" mx="auto" mt={70} align="center" justify="flex-start">
        <Flex mb={6} align="center" justify="space-between" height={190}>
          <HStack spacing={6} align="center" flex="1">
            <Avatar
              boxSize="12rem"
              src={state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg"}
            />

            <VStack align="start" spacing={4}>
              <HStack>
                <Text fontWeight="bold" w="80px">
                  닉네임
                </Text>
                <Text h="32px" lineHeight="32px">
                  {state.nickname}
                </Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" w="80px">
                  유저명
                </Text>
                <Text>{state.username}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" w="80px">
                  이메일
                </Text>
                <Text>{state.email}</Text>
              </HStack>
              <HStack>
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

          {/* <Button
            w="110px"
            bg="white"
            mb={4}
            onClick={() => navigate("/mypage/editprofile")}
            _hover={{
              borderWidth: "2px",
              bg: "black",
              color: "white",
            }}
          >
            프로필 편집
          </Button>
          <Button
            w="110px"
            bg="white"
            mb={4}
            onClick={() => navigate("/resetpassword")}
            _hover={{
              borderWidth: "2px",
              bg: "black",
              color: "white",
            }}
          >
            비밀번호 변경
          </Button>
          <Button
            w="110px"
            bg="white"
            color="red"
            _hover={{
              bg: "red",
              color: "white",
            }}
            onClick={() => setDeleteOpen(true)}
          >
            회원 탈퇴
          </Button>
         */}
        </VStack>
      </Flex>

      <Box maxW="3xl" mx="auto" px={4} mt={8} mb={20}>
        <Text fontSize={20} mb={4} fontWeight="bold">
          나의 게시물
        </Text>
        <MyPostsTable />
      </Box>
      <DeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
};

export default Profile;
