import React, { useState } from "react";
import { Box, Button, Input, FormControl, FormLabel, Heading, VStack, Text, Link, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SocialLoginButton from "@/components/siginComponents/SocialLoginButton.jsx";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    nickname: "",
    passwordConfirm: "",
  });

  const toast = useToast();
  const navigate = useNavigate();

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원가입 제출 핸들러
  const handleRegister = async (e) => {
    e.preventDefault();

    // 비밀번호 재입력 확인
    if (form.password !== form.passwordConfirm) {
      toast({
        title: "비밀번호 확인 오류",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const submitData = {
        email: form.email,
        password: form.password,
        username: form.username,
        nickname: form.nickname,
      };
      console.log(submitData);
      await axios.post("http://localhost:8084/api/sign-up", submitData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast({
        title: "회원가입 성공",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      console.log("중복 에러 내용: " + error.response.data.error);
      const message = error.response?.data?.error || "회원가입 실패";
      toast({
        title: "회원가입 실패",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">
        회원가입
      </Heading>
      <form onSubmit={handleRegister}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>이메일</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>이름</FormLabel>
            <Input
              type="text"
              name="username"
              placeholder="이름(실명) 입력"
              value={form.username}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>닉네임</FormLabel>
            <Input
              type="text"
              name="nickname"
              placeholder="닉네임 입력"
              value={form.nickname}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 다시 입력"
              value={form.passwordConfirm}
              onChange={handleChange}
            />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            회원가입
          </Button>

          <Text fontSize="sm">
            이미 계정이 있으신가요?{" "}
            <Link color="skyblue" onClick={() => navigate("/login")}>
              로그인
            </Link>
          </Text>
          <SocialLoginButton mode="signup" />
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
