import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Text,
  Link,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext.jsx";
import axios from "axios";
import SocialLoginButton from "@/components/siginComponents/SocialLoginButton.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const toast = useToast();
  const navigate = useNavigate();
  const { setState } = useUser();

  const CLIENT_ID = "637907069308-gj22lc6rllo5voogfgp7961vom90n4gu.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:5173/auth/redirect";
  const SCOPE = "email profile openid";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("보내는 데이터:", form);
      await axios.post("/api/sign-in", form, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast({
        title: "로그인 성공",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      const userRes = await axios.get("/api/user", { withCredentials: true });
      setState(userRes.data);
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
    <>
      <Box maxW="xl" mx="auto" mt={100} p={5} borderWidth={1} borderRadius="lg" mb={291}>
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
            <Button
              type="submit"
              bg="black"
              width="full"
              color="white"
              _hover={
                {
                  // bg: "gray",
                }
              }
            >
              로그인
            </Button>

            <Divider />

          <Text fontSize="sm">
            계정이 없으신가요?{" "}
            <Link color="skyblue" onClick={() => navigate("/register")}>
              회원가입
            </Link>
          </Text>
          <SocialLoginButton mode="login" />
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
