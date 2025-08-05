import React, { useState, useRef, useEffect } from "react";
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
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const BoardCreate = () => {
  const { state: user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const SUBJECT_LIST = ["일반", "음악", "후기", "정보", "질문"];
  const [subject, setSubject] = useState(SUBJECT_LIST[0]);

  const editorRef = useRef();

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
      await axios.post("/api/board/create", {
        title,
        content,
        memberId: user.memberId, // memberid는 가져오기
        nickname: user.nickname,
        subject,
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
    console.log("title:", title);
    console.log("content:", content);
    console.log("user:", user);
    console.log("memberId:", user?.id);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    .toastui-editor-tabs { display: none !important; }
    .toastui-editor-contents .toastui-editor-placeholder { display: none !important; }
  `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box maxW="700px" mx="auto" py={10} px={4}>
      <Heading as="h2" size="lg" mb={8} textAlign="left">
        게시글 작성
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
          <FormControl isInvalid={!!error && (!title.trim() || !content.trim())}>
            <FormLabel>제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
            />
          </FormControl>

          <Box id="board-create" maxW="700px" mx="auto" py={10} px={4}>
            <FormControl isInvalid={!!error}>
              <FormLabel>내용</FormLabel>
              <Editor
                ref={editorRef}
                initialValue=""
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                hideModeSwitch={true}
                // placeholder="내용을 입력하세요"
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </Box>

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
