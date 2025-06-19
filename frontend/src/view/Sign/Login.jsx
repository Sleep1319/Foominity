import React, { useState } from "react";
import { Box, Button, Input, FormControl, FormLabel, Heading, VStack, Text, Link, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  // Toast = 로그인 성공/실패 알림창
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8084/api/sign-in", form, {
        withCredentials: true, // 이거 쿠키 받기 위해 중요하다고 지피티가 그럼
        headers: { "Content-Type": "application/json" },
      });

      toast({ title: "로그인 성공", status: "success", duration: 2000, isClosable: true });
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "이메일/비밀번호를 확인해주세요.";
      toast({
        title: "로그인 실패",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="xl" mx="auto" mt={20} p={5} borderWidth={1} borderRadius="lg">
      <Heading mb={5} textAlign="center">
        로그인
      </Heading>
      <form onSubmit={handleLogin}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>이메일</FormLabel>
            <Input type="email" name="email" placeholder="email@example.com" onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>비밀번호</FormLabel>
            <Input type="password" name="password" placeholder="비밀번호 입력" onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
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
