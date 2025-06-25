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
      const message =
        error.response?.data?.message || "이메일/비밀번호를 확인해주세요.";
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
      <Box
        maxW="xl"
        mx="auto"
        mt={120}
        p={5}
        borderWidth={1}
        borderRadius="lg"
        mb={142}
      >
        <Heading mb={5} textAlign="center">
          로그인
        </Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              {/* <FormLabel>이메일</FormLabel> */}
              <Input
                border="none"
                borderBottom="1px solid"
                borderColor="gray.300"
                borderRadius="0"
                type="email"
                name="email"
                placeholder="아이디 입력 (email@example.com)"
                aria-label="이메일"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              {/* <FormLabel>비밀번호</FormLabel> */}
              <Input
                border="none"
                borderBottom="1px solid"
                borderColor="gray.300"
                borderRadius="0"
                type="password"
                name="password"
                placeholder="비밀번호 입력"
                aria-label="비밀번호"
                onChange={handleChange}
              />
            </FormControl>
            <Button
              type="submit"
              bg="black"
              width="full"
              color="white"
              _hover={{
                bg: "white",
                color: "black",
              }}
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
    </>
  );
};

export default Login;
