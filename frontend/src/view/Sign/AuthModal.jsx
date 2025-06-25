import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ButtonGroup,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Text,
  Divider,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext.jsx";
import SocialLoginButton from "@/components/siginComponents/SocialLoginButton.jsx";

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    nickname: "",
    passwordConfirm: "",
  });

  const toast = useToast();
  const navigate = useNavigate();
  const { setState } = useUser();

  // 모달이 닫히면 form 초기화
  useEffect(() => {
    if (!isOpen) {
      setForm({
        email: "",
        password: "",
        username: "",
        nickname: "",
        passwordConfirm: "",
      });
      setMode("login");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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

      toast({
        title: "로그인 성공",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      navigate("/");
    } catch (err) {
      toast({
        title: "로그인 실패",
        description:
          err.response?.data?.message || "이메일/비밀번호를 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
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
      const { email, password, username, nickname } = form;
      await axios.post(
        "/api/sign-up",
        { email, password, username, nickname },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast({
        title: "회원가입 성공",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // 비밀번호만 초기화하고 로그인 탭으로 전환
      setForm((prev) => ({
        ...prev,
        password: "",
        passwordConfirm: "",
      }));
      setMode("login");
    } catch (err) {
      toast({
        title: "회원가입 실패",
        description: err.response?.data?.error || "오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="md"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <ButtonGroup isAttached variant="outline" w="100%" mt={10}>
            <Button
              flex={1}
              colorScheme={mode === "login" ? "black" : "gray"}
              onClick={() => setMode("login")}
            >
              로그인
            </Button>
            <Button
              flex={1}
              colorScheme={mode === "register" ? "black" : "gray"}
              onClick={() => setMode("register")}
            >
              회원가입
            </Button>
          </ButtonGroup>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>이메일</FormLabel>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={form.email}
                />
              </FormControl>

              {mode === "register" && (
                <>
                  <FormControl isRequired>
                    <FormLabel>이름</FormLabel>
                    <Input
                      name="username"
                      type="text"
                      onChange={handleChange}
                      value={form.username}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>닉네임</FormLabel>
                    <Input
                      name="nickname"
                      type="text"
                      onChange={handleChange}
                      value={form.nickname}
                    />
                  </FormControl>
                </>
              )}

              <FormControl isRequired>
                <FormLabel>비밀번호</FormLabel>
                <Input
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  onChange={handleChange}
                  value={form.password}
                />
              </FormControl>

              {mode === "register" && (
                <FormControl isRequired>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <Input
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    value={form.passwordConfirm}
                  />
                </FormControl>
              )}

              <Button
                colorScheme="blue"
                type="submit"
                width="full"
                bg="black"
                _hover={{
                  bg: "gray",
                }}
              >
                {mode === "login" ? "로그인" : "회원가입"}
              </Button>

              {/* <Text fontSize="sm">
                {mode === "login" ? (
                  <>
                    계정이 없으신가요?{" "}
                    <Text
                      as="span"
                      color="skyblue"
                      cursor="pointer"
                      onClick={() => setMode("register")}
                    >
                      회원가입
                    </Text>
                  </>
                ) : (
                  <>
                    이미 계정이 있으신가요?{" "}
                    <Text
                      as="span"
                      color="skyblue"
                      cursor="pointer"
                      onClick={() => setMode("login")}
                    >
                      로그인
                    </Text>
                  </>
                )}
              </Text> */}
              <SocialLoginButton mode={mode} />
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
