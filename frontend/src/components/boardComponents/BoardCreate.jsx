import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BoardCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memberId, setMemberId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력하세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post("/api/board/create", {
        title,
        content,
        memberId,
      });
      toast({
        title: "게시글이 등록되었습니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      navigate("/board"); // 등록 후 목록으로 이동
    } catch (err) {
      console.log(err);
      setError("등록에 실패했습니다. 다시 시도해주세요.");
    }
    setIsSubmitting(false);
  };

  return (
    <Box maxW="700px" mx="auto" py={10} px={4}>
      <Heading as="h2" size="lg" mb={8} textAlign="left">
        게시글 작성
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!error && (!title.trim() || !content.trim())}>
            <FormLabel>제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
            />
          </FormControl>

          <FormControl isInvalid={!!error && (!title.trim() || !content.trim())}>
            <FormLabel>내용</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={10}
              maxLength={2000}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel>작성자 ID</FormLabel>
            <Input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="작성자 memberId를 입력하세요"
            />
          </FormControl>

          <Flex gap={3}>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting} px={10}>
              등록
            </Button>
            <Button variant="outline" onClick={() => navigate("/board")} px={8}>
              취소
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

export default BoardCreate;
