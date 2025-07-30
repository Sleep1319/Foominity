import React, { useState, useEffect, useRef } from "react";
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
  Select,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const BoardUpdate = () => {
  const { id } = useParams(); // 게시글 id
  const [title, setTitle] = useState("");
  // const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const editorRef = useRef();

  const SUBJECT_LIST = ["일반", "음악", "후기", "정보", "질문"];
  const [subject, setSubject] = useState(SUBJECT_LIST[0]);

  // 1. 기존 게시글 데이터 받아오기
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`/api/board/${id}`);
        setTitle(res.data.title);
        setSubject(res.data.subject);
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(res.data.content || "");
          }
        }, 0);
      } catch (err) {
        console.log(err);
        setError("게시글 정보를 불러올 수 없습니다.");
      }
      setLoading(false);
    };
    fetchBoard();
  }, [id]);

  // 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const content = editorRef.current?.getInstance().getMarkdown();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력하세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.put(`/api/board/update/${id}`, { title, content, subject });
      toast({
        title: "게시글이 수정되었습니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      navigate(`/board/${id}`);
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
          <FormControl>
            <FormLabel>카테고리</FormLabel>
            <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECT_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isInvalid={!!error && !title.trim()}>
            <FormLabel>제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
            />
          </FormControl>

          <FormControl isInvalid={!!error && !editorRef.current?.getInstance().getMarkdown().trim()}>
            <FormLabel>내용</FormLabel>
            <Editor
              ref={editorRef}
              initialValue=""
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              hideModeSwitch={true}
              placeholder="내용을 입력하세요"
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
