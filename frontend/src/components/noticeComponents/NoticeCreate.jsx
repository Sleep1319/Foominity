import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, Heading, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NoticeCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { state: user } = useUser();

  if (user?.roleName !== "ADMIN") {
    return (
      <Box p={6}>
        <Heading size="md">접근 권한이 없습니다.</Heading>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "모든 항목을 입력해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post("/api/notices/add", { title, content }, { withCredentials: true });
      toast({
        title: "공지 작성 완료",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/notice"); // 리스트 페이지로 이동
    } catch (error) {
      console.error("공지 작성 실패:", error);
      toast({
        title: "작성 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="1000px" mx="auto" mt={20} px={{ base: 4, md: 10 }}>
      <Heading size="lg" mb={6}>
        Magazine 작성
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <Box mb={4} fontSize="sm" color="gray.500">
          작성일: {new Date().toLocaleDateString("ko-KR")}
        </Box>

        <FormControl mb={4}>
          <FormLabel>대표 이미지</FormLabel>
          <Input type="file" accept="image/*" />
        </FormControl>

        <FormControl mb={6} isRequired>
          <FormLabel>내용</FormLabel>
          <Textarea rows={15} value={content} onChange={(e) => setContent(e.target.value)} />
        </FormControl>

        <Button type="submit" color="white" bg="black" size="sm" fontSize="sm" _hover={{ bg: "black", color: "white" }}>
          등록
        </Button>
      </form>
    </Box>
  );
};

export default NoticeCreate;
