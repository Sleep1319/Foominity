import React, { useState } from "react";
import { Button, Input, FormControl, VStack, Text, Link, Divider, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext.jsx";
import axios from "axios";
import SocialLoginButton from "@/components/siginComponents/SocialLoginButton.jsx";

const Login = ({ onClose }) => {
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
    <form onSubmit={handleLogin}>
      <VStack spacing={4} mb="20px">
        <FormControl isRequired>
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
        <HStack w="100%" justify="flex-end">
          <Link
            fontSize="sm"
            color="black"
            onClick={() => {
              navigate("/findpassword");
              onClose && onClose();
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
              onClose && onClose();
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
          _hover={{ bg: "gray.700" }}
        >
          로그인
        </Button>
        <SocialLoginButton mode="login" mb="20px"/>
      </VStack>
    </form>
  );
};

export default Login;
