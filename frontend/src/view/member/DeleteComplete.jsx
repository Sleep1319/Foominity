import { Box, Button, Heading, HStack, Link, LinkBox, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const DeleteComplete = () => {
  const navigate = useNavigate();
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
        height="85px"
      ></Text>
      <Box maxW="xl" mx="auto" mt={120} p={5} borderWidth={1} borderRadius="lg" mb={142} border="none">
        <VStack mt={20}>
          <Heading mb={5} textAlign="center">
            회원 탈퇴가 완료되었습니다.
          </Heading>
          <HStack mt={7}>
            <Button onClick={() => navigate("/")}>홈 화면으로 이동</Button>
            <Button onClick={() => navigate("/register")}>회원가입</Button>
          </HStack>
        </VStack>
      </Box>
    </>
  );
};

export default DeleteComplete;
