import React, { useEffect, useState } from "react";
import {Box, FormControl, Heading, VStack, FormLabel, Input, Button, useToast} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SocialRegister = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const query = new URLSearchParams(location.search);

    const email = query.get("email");
    const name = query.get("name");
    const socialType = query.get("socialType");
    const providerId = query.get("providerId");
    const reason = query.get("reason");

    const [nickname, setNickname] = useState("");

    useEffect(() => {
        if (reason === "not-registered") {
            toast({
                title: "회원 미등록",
                description: "등록되지 않은 회원입니다. 닉네임을 입력하여 회원가입을 완료해주세요.",
                status: "info",
                duration: 4000,
                isClosable: true,
            });
        } else if (reason === "new-user") {
            toast({
                title: "닉네임 입력 요청",
                description: "사용할 닉네임을 입력해주세요.",
                status: "info",
                duration: 4000,
                isClosable: true,
            });
        }
    }, [reason, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname.trim()) {
            toast({
                title: "닉네임 오류",
                description: "닉네임을 입력해주세요.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await axios.post("/api/social-sign-up", {
                email,
                username: name,
                nickname,
                socialType,
                providerId,
            });

            toast({
                title: "회원가입 완료",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // 로그인 다시 진행 (소셜 로그인으로 리다이렉트)
            window.location.href = `http://localhost:8084/oauth2/authorization/${socialType}`;
        } catch (error) {
            const message = error.response?.data?.error || "회원가입 실패";
            toast({
                title: "회원가입 실패",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading mb={6} textAlign="center">
                소셜 회원가입
            </Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>이메일</FormLabel>
                        <Input type="email" value={email} isReadOnly/>
                    </FormControl>

                    <FormControl>
                        <FormLabel>이름</FormLabel>
                        <Input type="text" value={name} isReadOnly/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>닉네임</FormLabel>
                        <Input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="사용할 닉네임을 입력하세요"
                        />
                    </FormControl>

                    <Button colorScheme="teal" type="submit" width="full">
                        회원가입 완료
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}

export default SocialRegister;