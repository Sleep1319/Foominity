import React from "react";
import { Box, Button, Input, FormControl, FormLabel, Heading, VStack, Text, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <Box maxW="xl" mx="auto" mt={20} p={5} borderWidth={1} borderRadius="lg">
      <Heading mb={5} textAlign="center">
        로그인
      </Heading>
      <form>
        {/* VStack은 수직으로만 쌓임 (그냥 Stack과의 차이점) */}
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>이메일</FormLabel>
            <Input type="email" placeholder="email@example.com" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>비밀번호</FormLabel>
            <Input type="password" placeholder="비밀번호 입력" />
          </FormControl>

          <Button colorScheme="blue" width="full">
            로그인
          </Button>
          <Text fontSize="sm">
            계정이 없으신가요?{" "}
            <Link color="skyblue" onClick={() => navigate("/register")}>
              회원가입
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
