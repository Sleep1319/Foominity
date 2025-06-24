import { Avatar, Box, HStack, Text, VStack, Flex, Button, Input } from "@chakra-ui/react";
import React from "react";
import DefaultTable from "../../components/reportComponents/DefaultTable.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";

const Profile = () => {
  const navigate = useNavigate();
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
        내 프로필
      </Text>

      <Flex maxW="3xl" mx="auto" mt={70} align="center" justify="flex-start">
        {/* <Box p={5} borderWidth={1} borderRadius="lg" flex="1" mr={6}> */}
        <Flex mb={6} align="center" justify="space-between" height={190}>
          <HStack spacing={6} align="center" flex="1">
            <Avatar boxSize="12rem" />
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
        <Button
          ml={130}
          mr={7}
          onClick={() => navigate("/mypage/editprofile")}
          _hover={{
            borderWidth: "2px",
            borderColor: "black",
            bg: "white",
          }}
        >
          편집
        </Button>
        {/* </Box> */}
      </Flex>

      <Box maxW="3xl" mx="auto" px={4} mt={8}>
        <Text fontSize={20} mb={4}>
          내가 쓴 게시물
        </Text>
        <DefaultTable />
      </Box>
    </>
  );
};

export default Profile;
