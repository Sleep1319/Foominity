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
  Divider,
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

  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return value.includes("@") ? "" : "올바른 이메일 형식이 아닙니다.";
      case "username":
        return /^[A-Za-z가-힣]{2,}$/.test(value) ? "" : "이름은 2자 이상 한글/영문";
      case "nickname":
        return /^[A-Za-z가-힣]{2,}$/.test(value) ? "" : "닉네임은 2자 이상 한글/영문";
      case "password":
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(value)
          ? ""
          : "비밀번호는 8자 이상, 문자+숫자+특수문자 포함";
      case "passwordConfirm":
        return value === form.password ? "" : "비밀번호가 일치하지 않습니다.";
      default:
        return "";
    }
  };

  const isFormValid =
    Object.values(form).every((v) => v.trim() !== "") && // 모든 입력값이 존재하는지
    Object.values(errors).every((v) => v === "") && // 모든 에러가 없는지
    isVerified; // 이메일 인증이 완료되었는지

  const checkNicknameDuplicate = async (nickname) => {
    try {
      const res = await axios.get("/api/check-nickname", { params: { nickname } });
      if (res.data.exists) {
        setErrors((prev) => ({ ...prev, nickname: "이미 사용 중인 닉네임입니다." }));
      }
    } catch (err) {
      toast({
        title: "닉네임 확인 오류",
        description: err.response?.data?.error,
        status: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "nickname" && !error) {
      checkNicknameDuplicate(value);
    }
  };

  const startTimer = (expiresAtIso) => {
    if (!expiresAtIso) return;
    const end = new Date(expiresAtIso).getTime();
    const now = Date.now();
    const remain = Math.max(0, Math.floor((end - now) / 1000));
    setTimer(remain);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  React.useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss < 10 ? "0" : ""}${ss}`;
  };
  const [timer, setTimer] = useState(0);
  const timerRef = React.useRef(null);

  const handleSendCode = async () => {
    if (isSending) return;                 //연타 방지
    const emailError = validateField("email", form.email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    try {
      const resCheck = await axios.get("/api/check-email", { params: { email: form.email } });
      if (resCheck.data.exists) {
        setErrors((prev) => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
        return;
      }
    } catch (err) {
      toast({ title: "이메일 확인 오류", description: err.response?.data?.error, status: "error" });
      return;
    }

    try {
      setIsSending(true);                  //누르자마자 잠금 + 표시
      const { data } = await axios.post(
          "/api/email/send-code",
          null,
          { params: { email: form.email }, timeout: 15000 } //타임아웃
      );
      startTimer(data?.expiresAt);         //타이머 시작
      setCodeSent(true);
      setIsVerified(false);
      setCode("");
      toast({ title: "인증 코드가 전송되었습니다", status: "success" });
    } catch (err) {
      const msg = err.response?.data?.error || "코드 전송 실패";
      toast({ title: "코드 전송 실패", description: msg, status: "error" });
    } finally {
      setIsSending(false);                 //응답 받으면 잠금 해제 (이후 타이머가 버튼 제어)
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post("/api/email/verify", null, { params: { email: form.email, code } });
      setIsVerified(true);
      if (timerRef.current) clearInterval(timerRef.current);
      toast({ title: "인증 성공", status: "success" });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error || "인증 실패";
      if (status === 410) {
        // 만료
        setIsVerified(false);
        setTimer(0);
        toast({ title: "코드 만료", description: "다시 인증 요청해주세요.", status: "warning" });
      } else {
        toast({ title: "인증 실패", description: msg, status: "error" });
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("/api/sign-up", form);
      alert("회원가입이 성공적으로 완료되었습니다.");
      window.location.href = "/loginpage";
    } catch (err) {
      toast({ title: "회원가입 실패", description: err.response?.data?.error, status: "error" });
    }
  };

  return (
    <>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        // borderBottom="2px solid gray"
        pb={2}
        mt={4}
        ml={5}
        height="85px"
      ></Text>
      <Heading mt={10} mb={3} textAlign="center" fontSize={40}>
        회원가입
      </Heading>
      <Box maxW="lg" mx="auto" p={8} mb="37px" borderRadius="lg" borderWidth={0}>
        {/* <Heading mb={6} textAlign="center">
          회원가입
        </Heading> */}
        <form onSubmit={handleRegister}>
          <VStack spacing={5} align="stretch">
            <FormControl isRequired>
              <FormLabel>이메일</FormLabel>
              <HStack>
                <Input name="email" type="email" value={form.email} onChange={handleChange} isReadOnly={isVerified || isSending} />
                <Button
                  onClick={handleSendCode}
                  size="sm"
                  isLoading={isSending}
                  loadingText="전송중..."
                  isDisabled={!form.email || !!errors.email || isVerified || isSending || (codeSent && timer > 0)}
                  _disabled={{
                    opacity: 0.4,
                    cursor: "default",
                    pointerEvents: "auto", // 기본 이벤트 허용하는 코드
                  }}
                >
                  {codeSent && !isVerified
                      ? (timer > 0 ? `재전송 (${fmt(timer)})` : "재전송")
                      : "인증 요청"}
                </Button>
              </HStack>
              {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
              {isSending && (
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    인증번호 전송중입니다...
                  </Text>
              )}
              {codeSent && !isVerified && (
                  <Text fontSize="xs" color={timer > 0 ? "gray.600" : "red.500"} mt={1}>
                    {timer > 0 ? `코드 유효시간 ${fmt(timer)} 남음` : "코드가 만료되었습니다. 재전송해주세요."}
                  </Text>
              )}
            </FormControl>

            {codeSent && (
              <FormControl isRequired>
                <FormLabel>인증 코드</FormLabel>
                <HStack>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    isReadOnly={isVerified}
                    placeholder="코드 입력"
                  />
                  <Button
                    onClick={handleVerifyCode}
                    size="sm"
                    colorScheme={isVerified ? "green" : "blue"}
                    isDisabled={!code || isVerified}
                    _disabled={{
                      opacity: 0.4,
                      cursor: "default",
                      pointerEvents: "auto", // 기본 이벤트 허용하는 코드
                    }}
                  >
                    {isVerified ? "완료" : "확인"}
                  </Button>
                </HStack>
              </FormControl>
            )}

            {[
              { name: "username", label: "이름", placeholder: "이름 입력" },
              { name: "nickname", label: "닉네임", placeholder: "닉네임 입력" },
              { name: "password", label: "비밀번호", placeholder: "비밀번호 입력", type: "password" },
              { name: "passwordConfirm", label: "비밀번호 확인", placeholder: "비밀번호 재입력", type: "password" },
            ].map(({ name, label, placeholder, type = "text" }) => (
              <FormControl isRequired key={name}>
                <FormLabel>{label}</FormLabel>
                <Input name={name} placeholder={placeholder} value={form[name]} onChange={handleChange} type={type} />
                {errors[name] && (
                  <Text color="red.500" fontSize="sm">
                    {errors[name]}
                  </Text>
                )}
              </FormControl>
            ))}

            <Button
              mt={7}
              type="submit"
              colorScheme="blackAlpha"
              bg="black"
              color="white"
              _hover={{ bg: "gray.700" }}
              isDisabled={!isFormValid}
              _disabled={{
                opacity: 0.4,
                cursor: "default",
                pointerEvents: "auto", // 기본 이벤트 허용하는 코드
              }}
            >
              회원가입
            </Button>

            {/* <Divider /> */}
            <SocialLoginButton mode="signup" />
            <Text fontSize="sm" textAlign="center" mt="5px">
              이미 계정이 있으신가요?{" "}
              <Link color="skyblue" onClick={() => navigate("/loginpage")}>
                로그인
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default Register;
