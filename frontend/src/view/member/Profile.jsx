import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Flex,
  Button,
} from "@chakra-ui/react";
import React from "react";
import DefaultTable from "../../components/reportComponents/DefaultTable.jsx";
import { useNavigate } from "react-router-dom";

const Profile = ({ nickname, userName, userGrade, userPoints }) => {
  const navigate = useNavigate();
  return (
    <>
      <Text
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        pb={2}
        mt={4}
        ml={5}
      >
        내 프로필
      </Text>

      <Flex maxW="3xl" mx="auto" mt={7} align="center" justify="flex-start">
        <Box p={5} borderWidth={1} borderRadius="lg" flex="1" mr={6}>
          <Flex mb={6} align="center" justify="space-between">
            <HStack spacing={6} align="center" flex="1">
              <Avatar size="2xl" />
              <VStack align="start" spacing={4}>
                <HStack>
                  <Text fontWeight="bold" w="80px">
                    닉네임
                  </Text>
                  <Text>{nickname}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" w="80px">
                    실명
                  </Text>
                  <Text>{userName}</Text>
                </HStack>
              </VStack>
            </HStack>

            <Button
              ml={6}
              mr={7}
              onClick={() => navigate("/mypage/editprofile")}
            >
              편집
            </Button>
          </Flex>
        </Box>

        <VStack align="end" spacing={2} minW="120px" ml={4}>
          <Text fontWeight="bold">등급</Text>
          <Text>{userGrade}</Text>
          <Text fontWeight="bold" pt={2}>
            포인트
          </Text>
          <Text>{userPoints}</Text>
        </VStack>
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
