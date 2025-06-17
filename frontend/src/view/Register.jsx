import React from "react";
import { Box, Button, Input, FormControl, FormLabel, Heading, VStack, Text, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">
        회원가입
      </Heading>
      <form>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>이메일</FormLabel>
            <Input type="email" placeholder="email@example.com" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>이름</FormLabel>
            <Input type="text" placeholder="이름(실명) 입력" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>닉네임</FormLabel>
            <Input type="text" placeholder="닉네임 입력" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>비밀번호</FormLabel>
            <Input type="password" placeholder="비밀번호 입력" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input type="password" placeholder="비밀번호 다시 입력" />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            회원가입
          </Button>

          <Text fontSize="sm">
            이미 계정이 있으신가요?{" "}
            <Link color="skyblue" onClick={() => navigate("/")}>
              로그인
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
