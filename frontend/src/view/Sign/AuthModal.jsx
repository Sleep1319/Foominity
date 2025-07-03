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
  Link,
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
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

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

  const handleSendCode = async () => {
    if (!form.email.includes("@")) {
      toast({ title: "이메일 형식 오류", status: "error" });
      return;
    }
    try {
      await axios.post("/api/email/send-code", null, { params: { email: form.email } });
      toast({ title: "인증 코드 전송됨", status: "success" });
      setCodeSent(true);
      setIsVerified(false);
    } catch (err) {
      toast({ title: "코드 전송 실패", description: err.response?.data?.error, status: "error" });
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post("/api/email/verify", null, { params: { email: form.email, code } });
      toast({ title: "인증 성공", status: "success" });
      setIsVerified(true);
    } catch (err) {
      toast({ title: "인증 실패", description: err.response?.data?.error, status: "error" });
      setIsVerified(false);
    }
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
        description: err.response?.data?.message || "이메일/비밀번호를 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, password, username, nickname, passwordConfirm } = form;

    // 1. 이메일 중복 확인
    try {
      console.log("이메일 값", form.email);

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
        title: "오류 발생",
        description: err.response?.data?.error || "이메일 확인 중 문제가 발생했습니다.",
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
        description: "닉네임은 2글자 이상, 한글 또는 영문만 입력 가능합니다.",
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
        description: "비밀번호는 최소 8자, 영문·숫자·특수문자를 포함해야 합니다.",
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

    // 6. 서버에 회원가입 요청
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <ButtonGroup isAttached variant="outline" w="100%" mt={10}>
            <Button flex={1} colorScheme={mode === "login" ? "black" : "gray"} onClick={() => setMode("login")}>
              로그인
            </Button>
            <Button flex={1} colorScheme={mode === "register" ? "black" : "gray"} onClick={() => setMode("register")}>
              회원가입
            </Button>
          </ButtonGroup>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            <VStack spacing={4}>
              {mode === "login" && (
                <>
                  <FormControl isRequired>
                    {/* <FormLabel>아이디 (이메일)</FormLabel> */}
                    <Input
                      border="none"
                      borderBottom="1px solid"
                      borderColor="gray.300"
                      borderRadius="0"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      aria-label="이메일"
                      placeholder="example@email.com"
                      // variant="filled"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    {/* <FormLabel>비밀번호</FormLabel> */}
                    <Input
                      border="none"
                      borderBottom="1px solid"
                      borderColor="gray.300"
                      borderRadius="0"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      aria-label="비밀번호"
                      placeholder="비밀번호 입력"
                      // variant="filled"
                    />
                  </FormControl>
                </>
              )}

              {mode === "register" && (
                <>
                  <FormControl isRequired>
                    {/*  <FormLabel>아이디 (이메일)</FormLabel>*/}
                    {/*  <Input*/}
                    {/*    name="email"*/}
                    {/*    type="email"*/}
                    {/*    value={form.email}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    placeholder="이메일 입력 (email@example.com)"*/}
                    {/*    variant="outline"*/}
                    {/*  />*/}
                    {/*</FormControl>*/}
                    <FormLabel>이메일</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      isReadOnly={isVerified}
                    />
                    <Button mt={2} size="sm" onClick={handleSendCode}>
                      인증 코드 전송
                    </Button>
                  </FormControl>
                  {codeSent && (
                    <FormControl isRequired>
                      <FormLabel>인증 코드</FormLabel>
                      <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="인증 코드 입력" />
                      <Button mt={2} size="sm" onClick={handleVerifyCode} colorScheme={isVerified ? "green" : "blue"}>
                        {isVerified ? "✅ 인증 완료" : "코드 확인"}
                      </Button>
                    </FormControl>
                  )}
                  <FormControl isRequired>
                    <FormLabel>이름</FormLabel>
                    <Input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="이름 입력 (예: 김민성)"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>닉네임</FormLabel>
                    <Input name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임 입력" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>비밀번호</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="영문·숫자·특수문자 포함 8자 이상 입력하세요."
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <Input
                      name="passwordConfirm"
                      type="password"
                      value={form.passwordConfirm}
                      onChange={handleChange}
                      placeholder="비밀번호를 다시 입력하세요."
                      autoComplete="new-password"
                    />
                  </FormControl>
                </>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                bg="black"
                _hover={{ bg: "gray" }}
                isDisabled={mode === "register" && !isVerified}
              >
                {mode === "login" ? "로그인" : "회원가입"}
              </Button>

              <SocialLoginButton mode={mode} />
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
