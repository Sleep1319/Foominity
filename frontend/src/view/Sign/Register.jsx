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
  HStack,
} from "@chakra-ui/react";
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
  // const handleRegister = async (e) => {
  //   e.preventDefault();

  //   // 비밀번호 재입력 확인
  //   if (form.password !== form.passwordConfirm) {
  //     toast({
  //       title: "비밀번호 확인 오류",
  //       description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     return;
  //   }

  //   try {
  //     const submitData = {
  //       email: form.email,
  //       password: form.password,
  //       username: form.username,
  //       nickname: form.nickname,
  //     };
  //     console.log(submitData);
  //     await axios.post("http://localhost:8084/api/sign-up", submitData, {
  //       withCredentials: true,
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     toast({
  //       title: "회원가입 성공",
  //       status: "success",
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //     navigate("/login");
  //   } catch (error) {
  //     console.log("중복 에러 내용: " + error.response.data.error);
  //     const message = error.response?.data?.error || "회원가입 실패";
  //     toast({
  //       title: "회원가입 실패",
  //       description: message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };
  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, password, username, nickname, passwordConfirm } = form;

    // 1. 이메일 중복 확인
    try {
      const res = await axios.get("/api/check-email", { params: { email } });
      if (res.data.exists) {
        toast({
          title: "회원가입 실패",
          description: "이미 사용 중인 이메일입니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } catch (err) {
      toast({
        title: "이메일 확인 오류",
        description: err.response?.data?.error || "이메일 중복 확인 중 문제가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 2. 이름 형식 검사
    const usernameRegex = /^[A-Za-z가-힣]{2,}$/;
    if (!usernameRegex.test(username)) {
      toast({
        title: "이름 형식 오류",
        description: "이름은 한글 또는 영문으로 2자 이상 입력해야 합니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 3. 닉네임 형식 검사
    const nicknameRegex = /^[A-Za-z가-힣]{2,}$/;
    if (!nicknameRegex.test(nickname)) {
      toast({
        title: "닉네임 형식 오류",
        description: "닉네임은 한글 또는 영문으로 2자 이상 입력해야 합니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 4. 비밀번호 형식 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast({
        title: "비밀번호 형식 오류",
        description: "비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 포함해야 합니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 5. 비밀번호 확인
    if (password !== passwordConfirm) {
      toast({
        title: "비밀번호 확인 오류",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 6. 회원가입 요청
    try {
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
      navigate("/login");
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

      <Box maxW="lg" mx="auto" mt={20} p={8} mb={90} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading mb={6} textAlign="center">
          회원가입
        </Heading>
        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl isRequired width="auto">
              <HStack>
                <FormLabel mb={0} w="120px" mr={-2} pl={10} ml={1.5}>
                  아이디
                </FormLabel>
                <Input
                  w="300px"
                  type="email"
                  name="email"
                  placeholder="이메일 형식으로 입력"
                  value={form.email}
                  onChange={handleChange}
                />
              </HStack>
            </FormControl>

            <FormControl isRequired width="auto">
              <HStack>
                <FormLabel mb={0} w="120px" mr={-1} pl={59}>
                  이름
                </FormLabel>
                <Input
                  w="300px"
                  type="text"
                  name="username"
                  placeholder="이름 입력 (예: 김민성)"
                  value={form.username}
                  onChange={handleChange}
                />
              </HStack>
            </FormControl>

            <FormControl isRequired width="auto">
              <HStack>
                <FormLabel mb={0} w="120px" mr={-2} pl={10} ml={1.5}>
                  닉네임
                </FormLabel>
                <Input
                  w="300px"
                  type="text"
                  name="nickname"
                  placeholder="닉네임 입력"
                  value={form.nickname}
                  onChange={handleChange}
                />
              </HStack>
            </FormControl>

            <FormControl isRequired width="auto">
              <HStack>
                <FormLabel mb={0} w="120px" mr={-1} pl={8}>
                  비밀번호
                </FormLabel>
                <Input
                  w="300px"
                  type="password"
                  name="password"
                  placeholder="비밀번호 입력"
                  value={form.password}
                  onChange={handleChange}
                />
              </HStack>
            </FormControl>

            <FormControl isRequired width="auto">
              <HStack>
                <FormLabel mb={0} w="105px">
                  비밀번호 확인
                </FormLabel>
                <Input
                  w="300px"
                  type="password"
                  name="passwordConfirm"
                  placeholder="비밀번호 다시 입력"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                />
              </HStack>
            </FormControl>

            <Button
              bg="black"
              type="submit"
              width="full"
              color="white"
              _hover={{
                bg: "white",
                color: "black",
              }}
            >
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
    </>
  );
};

export default Register;
