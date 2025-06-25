import { Avatar, Box, HStack, Text, VStack, Flex, Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import DefaultTable from "../../components/reportComponents/DefaultTable.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import DeleteModal from "../../view/Member/DeleteModal.jsx";
const Profile = () => {
  const navigate = useNavigate();
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
        내 프로필
      </Text>

      <Flex maxW="3xl" mx="auto" mt={70} align="center" justify="flex-start">
        {/* <Box p={5} borderWidth={1} borderRadius="lg" flex="1" mr={6}> */}
        <Flex mb={6} align="center" justify="space-between" height={190}>
          <HStack spacing={6} align="center" flex="1">
            {/* <Avatar boxSize="12rem" /> */}
            <Avatar boxSize="12rem" src={state.avatar ? `http://localhost:8084${state.avatar}` : undefined} />

            <VStack align="start" spacing={4}>
              <HStack>
                <Text fontWeight="bold" w="80px">
                  닉네임
                </Text>
                <Text h="32px" lineHeight="32px">
                  {state.nickname}
                </Text>
                {/* <Text>{state.nickname}</Text> */}
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
          <Button
            w="85px"
            bg="white"
            // border="1px solid black"
            onClick={() => navigate("/mypage/editprofile")}
            _hover={{
              borderWidth: "2px",
              // borderColor: "black",
              // bg: "white",
              bg: "black",
              color: "white",
            }}
          >
            편집
          </Button>

          {/* 회원 탈퇴 버튼 */}
          <Button
            w="85px"
            bg="white"
            color="red"
            // border="1px solid black"
            _hover={{
              // borderWidth: "2px",
              // borderColor: "red",
              bg: "red",
              color: "white",
            }}
            onClick={() => setDeleteOpen(true)}
          >
            회원 탈퇴
          </Button>
        </VStack>
        {/* </Box> */}
      </Flex>

      <Box maxW="3xl" mx="auto" px={4} mt={8}>
        <Text fontSize={20} mb={4}>
          내가 쓴 게시물
        </Text>
        <DefaultTable />
      </Box>
      <DeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
};

export default Profile;
