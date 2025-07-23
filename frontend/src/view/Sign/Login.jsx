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
  Divider,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext.jsx";
import axios from "axios";
import SocialLoginButton from "@/components/siginComponents/SocialLoginButton.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setState } = useUser();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        "/api/sign-in",
        { email: form.email, password: form.password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const userRes = await axios.get("/api/user", { withCredentials: true });
      setState(userRes.data);

      setTimeout(() => {
        window.location.href = "/";
      }, 200);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.response?.data?.message || "이메일 혹은 비밀번호를 확인해 주세요.");
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
      <Heading mt={120} mb={2} textAlign="center">
        로그인
      </Heading>
      {/* <Image
        src="/src/assets/images/doremiSOL_lp.png"
        boxSize="250px"
        objectFit="cover"
        display="block" // inline 요소인 이미지를 block 으로 전환
        mx="auto" // 좌우 margin: auto
        mt="60px"
        mb="-60px"
      /> */}
      <Box maxW="xl" mx="auto" mt={0} p={5} borderWidth={0} borderRadius="lg" mb={142}>
        {/* <Heading mb={5} textAlign="center">
          로그인
        </Heading> */}
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <Input
                mt={3}
                border="none"
                borderBottom="1px solid"
                borderColor="gray.300"
                borderRadius="0"
                type="email"
                name="email"
                placeholder="아이디 입력 (email@example.com)"
                aria-label="이메일"
                onChange={handleChange}
                value={form.email}
              />
            </FormControl>
            <FormControl isRequired>
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
                value={form.password}
              />
            </FormControl>
            {errorMessage && (
              <Text color="red.500" fontSize="sm" alignSelf="start" mt={-2}>
                {errorMessage}
              </Text>
            )}
            <HStack ml={380} justify="center">
              <Link
                fontSize="sm"
                color="black"
                onClick={() => {
                  navigate("/resetpassword");
                }}
              >
                비밀번호 찾기
              </Link>
              <Divider orientation="vertical" h="12px" borderColor="gray.300" />
              <Link
                fontSize="sm"
                color="black"
                onClick={() => {
                  navigate("/register");
                }}
              >
                회원가입
              </Link>
            </HStack>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="로그인 중..."
              bg="black"
              width="full"
              color="white"
              _hover={{
                bg: "gray.700",
              }}
            >
              로그인
            </Button>
            {/* <Divider /> */}
            <SocialLoginButton mode="login" />
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default Login;
