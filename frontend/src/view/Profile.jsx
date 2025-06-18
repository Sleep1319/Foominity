import { Avatar, Box, Button, FormControl, FormLabel, HStack, Input, Table, Text, VStack } from "@chakra-ui/react";
import React from "react";
import DefaultTable from "../components/DefaultTable";

const Profile = ({ nickname, userName }) => {
  return (
    <>
      <Text fontSize="3xl" fontWeight="medium" borderBottom="2px solid gray" pb={2} mt={4} ml={5}>
        내 프로필
      </Text>
      <Box maxW="3xl" mx="auto" mt={7} p={5} borderWidth={1} borderRadius="lg">
        <HStack spacing={6} align="start" mb={6}>
          <Avatar size="2xl" />
          <VStack align="start" spacing={2}>
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
      </Box>
      <Text fontSize={20} ml={2} mt={8}>
        내가 쓴 게시물
      </Text>
      <DefaultTable />
    </>
  );
};

export default Profile;
