import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, Heading, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NoticeCreate = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      toast({
        title: "제목과 내용을 모두 입력해주세요.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post("/api/notice/add", form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast({
        title: "공지 작성 완료",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/notice");
    } catch (err) {
      console.error("공지 작성 실패", err);
      toast({
        title: "작성 실패",
        description: err.response?.data?.error || "문제가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="2xl" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading mb={6}>공지 작성</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl isRequired>
            <FormLabel>제목</FormLabel>
            <Input name="title" value={form.title} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>내용</FormLabel>
            <Textarea name="content" value={form.content} onChange={handleChange} rows={6} />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            작성 완료
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default NoticeCreate;
