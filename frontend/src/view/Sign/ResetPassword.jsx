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
  useToast,
  HStack,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password)
      ? ""
      : "비밀번호는 8자 이상, 문자+숫자+특수문자 포함";
  };

  const handleSendCode = async () => {
    if (!email.includes("@")) {
      toast({ title: "올바른 이메일 형식이 아닙니다.", status: "error" });
      return;
    }

    try {
      // 가입된 이메일인지 확인
      const res = await axios.get("/api/check-email", { params: { email } });
      if (!res.data.exists) {
        toast({ title: "가입되지 않은 이메일입니다.", status: "error" });
        return;
      }
    } catch (err) {
      toast({
        title: "이메일 확인 실패",
        description: err.response?.data?.error || "서버 오류",
        status: "error",
      });
      return;
    }

    try {
      // 인증 코드 전송
      await axios.post("/api/email/send-code", null, { params: { email } });
      toast({ title: "인증 코드가 전송되었습니다.", status: "success" });
      setCodeSent(true);
    } catch (err) {
      toast({
        title: "코드 전송 실패",
        description: err.response?.data?.error,
        status: "error",
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post("/api/email/verify", null, { params: { email, code } });
      toast({ title: "이메일 인증 성공", status: "success" });
      setIsVerified(true);
    } catch (err) {
      toast({
        title: "인증 실패",
        description: err.response?.data?.error,
        status: "error",
      });
    }
  };

  const handleResetPassword = async () => {
    const pwError = validatePassword(newPassword);
    if (pwError) {
      toast({ title: "비밀번호 오류", description: pwError, status: "error" });
      return;
    }

    if (newPassword !== passwordConfirm) {
      toast({ title: "비밀번호 불일치", description: "비밀번호가 일치하지 않습니다.", status: "error" });
      return;
    }

    try {
      await axios.post("/api/reset-password", {
        email,
        newPassword,
      });
      toast({ title: "비밀번호가 변경되었습니다.", status: "success" });
      navigate("/login");
    } catch (err) {
      toast({
        title: "비밀번호 변경 실패",
        description: err.response?.data?.error,
        status: "error",
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
      <Box maxW="lg" mx="auto" mt={10} p={8} borderRadius="lg" borderWidth={0} mb={24}>
        <Image
          src="/src/assets/images/doremiSOL_lp.png"
          boxSize="250px"
          objectFit="cover"
          display="block" // inline 요소인 이미지를 block 으로 전환
          mx="auto" // 좌우 margin: auto
          mt="-70px"
        />
        {/* <Heading fontSize={40} mb={3} textAlign="center">
          doremiSOL
        </Heading> */}
        <Text textAlign="center" fontSize={18} fontWeight="semibold" mb={5} mt="-55px">
          비밀번호 변경을 위한 이메일 인증을 진행합니다
        </Text>
        {/* <Text textAlign="center" fontSize={18} fontWeight="semibold" mb={10}>
          가입에 사용하신 이메일을 입력해 주세요
        </Text> */}
        <VStack spacing={5} align="stretch">
          <FormControl isRequired>
            {/* <FormLabel>이메일</FormLabel> */}
            <HStack>
              <Input
                type="email"
                value={email}
                placeholder="가입에 사용하신 이메일을 입력해 주세요"
                onChange={(e) => setEmail(e.target.value)}
                isReadOnly={isVerified}
              />
              <Button
                size="sm"
                onClick={handleSendCode}
                isDisabled={!email || isVerified}
                _disabled={{
                  opacity: 0.4,
                  cursor: "default",
                  pointerEvents: "auto",
                }}
              >
                인증 요청
              </Button>
            </HStack>
          </FormControl>

          {codeSent && (
            <FormControl isRequired>
              {/* <FormLabel>인증 코드</FormLabel> */}
              <HStack>
                <Input
                  placeholder="인증 코드 입력"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  isReadOnly={isVerified}
                />
                <Button
                  size="sm"
                  onClick={handleVerifyCode}
                  isDisabled={!code || isVerified}
                  _disabled={{
                    opacity: 0.4,
                    cursor: "default",
                    pointerEvents: "auto",
                  }}
                  colorScheme={isVerified ? "green" : "blue"}
                >
                  {isVerified ? "완료" : "확인"}
                </Button>
              </HStack>
            </FormControl>
          )}

          {isVerified && (
            <>
              <FormControl isRequired>
                <FormLabel>새 비밀번호</FormLabel>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>새 비밀번호 확인</FormLabel>
                <Input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
              </FormControl>

              <Button
                colorScheme="blue"
                onClick={handleResetPassword}
                bg="black"
                color="white"
                _hover={{
                  bg: "gray.700",
                }}
              >
                비밀번호 변경
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </>
  );
};

export default ResetPassword;
