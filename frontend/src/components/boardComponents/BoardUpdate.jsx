import React, { useState, useEffect } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BoardUpdate = () => {
  const { id } = useParams(); // 게시글 id
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // 1. 기존 게시글 데이터 받아오기
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`/api/board/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.log(err);
        setError("게시글 정보를 불러올 수 없습니다.");
      }
      setLoading(false);
    };
    fetchBoard();
  }, [id]);

  // 2. 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력하세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.put(
        `/api/board/update/${id}`,
        { title, content }
        // 필요시 memberId 추가
      );
      toast({
        title: "게시글이 수정되었습니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      navigate(`/board/${id}`); // 수정 후 상세페이지로 이동
    } catch (err) {
      console.log(err);
      setError("수정에 실패했습니다. 다시 시도해주세요.");
    }
    setIsSubmitting(false);
  };

  // 3. 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`/api/board/delete/${id}`, { withCredentials: true });
      toast({
        title: "게시글이 삭제되었습니다.",
        status: "info",
        duration: 1500,
        isClosable: true,
      });
      navigate("/board");
    } catch (err) {
      console.log(err);
      setError("삭제에 실패했습니다. 다시 시도해주세요.");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="700px" mx="auto" py={10} px={4}>
      <Heading as="h2" size="lg" mb={8} textAlign="left">
        게시글 수정
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!error && !title.trim()}>
            <FormLabel>제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
            />
          </FormControl>

          <FormControl isInvalid={!!error && !content.trim()}>
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

          <Flex gap={3}>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting} px={10}>
              수정
            </Button>
            <Button variant="outline" onClick={() => navigate(`/board/${id}`)} px={8} disabled={isSubmitting}>
              취소
            </Button>
            <Button colorScheme="red" variant="outline" onClick={handleDelete} px={8} disabled={isSubmitting}>
              삭제
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

export default BoardUpdate;
