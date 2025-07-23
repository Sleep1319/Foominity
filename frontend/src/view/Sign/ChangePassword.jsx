import React, { useState } from "react";
import { Box, Button, Input, FormControl, FormLabel, Heading, VStack, Text, useToast, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password)
      ? ""
      : "비밀번호는 8자 이상, 문자+숫자+특수문자 포함";

  // 1. 현재 비밀번호 검증
  const handleVerifyCurrentPassword = async () => {
    if (!currentPassword) {
      toast({ title: "비밀번호를 입력하세요.", status: "error" });
      return;
    }
    try {
      await axios.post("/api/check-password", { currentPassword });
      toast({ title: "확인되었습니다.", status: "success" });
      setIsVerified(true);
    } catch (err) {
      toast({
        title: "비밀번호가 일치하지 않습니다.",
        status: "error",
      });
      console.log("오류 : ", err);
    }
  };

  // 2. 새 비밀번호 변경
  const handleChangePassword = async () => {
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
      await axios.put("/api/change-password", {
        currentPassword,
        newPassword,
      });
      toast({ title: "비밀번호가 변경되었습니다.", status: "success" });
      navigate("/mypage"); // 또는 마이페이지 이동 등 원하는 대로
    } catch (err) {
      toast({
        title: "비밀번호 변경 실패",
        description: err.response?.data?.message || err.message,
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
        <Heading fontSize={40} mb={3} textAlign="center">
          비밀번호 변경
        </Heading>
        <Text textAlign="center" fontSize={18} fontWeight="semibold" mb={5} mt="30px">
          현재 사용중이신 비밀번호를 입력해 주세요.
        </Text>
        <VStack spacing={5} align="stretch">
          <FormControl isRequired>
            <HStack>
              <Input
                type="password"
                value={currentPassword}
                placeholder="현재 비밀번호 입력"
                onChange={(e) => setCurrentPassword(e.target.value)}
                isReadOnly={isVerified}
              />
              <Button
                size="sm"
                onClick={handleVerifyCurrentPassword}
                isDisabled={!currentPassword || isVerified}
                _disabled={{
                  opacity: 0.4,
                  cursor: "default",
                  pointerEvents: "auto",
                }}
              >
                확인
              </Button>
            </HStack>
          </FormControl>

          {isVerified && (
            <>
              <FormControl isRequired>
                <FormLabel>새 비밀번호</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>새 비밀번호 확인</FormLabel>
                <Input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="새 비밀번호 확인"
                />
              </FormControl>

              <Button
                colorScheme="blue"
                onClick={handleChangePassword}
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

export default ChangePassword;
