import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
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
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("일반");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const editorRef = useRef();

  const SUBJECT_LIST = ["일반", "음악", "후기", "정보", "질문"];

  // 기존 글 로드
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`/api/board/${id}`, { withCredentials: true });
        setTitle(res.data.title);
        setSubject(res.data.subject);
        // 에디터가 렌더된 다음 콘텐츠 주입
        setTimeout(() => {
          editorRef.current?.getInstance?.().setMarkdown(res.data.content || "");
        }, 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  // 수정 저장 (multipart/form-data 로 전송)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const currentContent = editorRef.current?.getInstance?.().getMarkdown?.() || "";

      const form = new FormData();
      const payload = { title, content: currentContent, subject };
      form.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      // (옵션) 이미지 추가/삭제를 지원하려면 여기에 추가:
      // newImages.forEach((f) => form.append("newImages", f));
      // deleteImageIds.forEach((id) => form.append("deleteImageIds", id));

      await axios.put(`/api/board/update/${id}`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "게시글이 수정되었습니다.", status: "success", duration: 1500, isClosable: true });
      navigate(`/board/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`/api/board/delete/${id}`, { withCredentials: true });
      toast({ title: "게시글이 삭제되었습니다.", status: "info", duration: 1500, isClosable: true });
      navigate("/board");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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

          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>내용</FormLabel>
            <Box fontSize="sm" color="gray.500" mb={2}>
              이미지를 삽입하려면 에디터 툴바의 이미지 기능을 사용하세요.
              <br />
              업로드된 이미지는 선택 후 <b>Backspace</b> 또는 <b>Delete</b> 키로 삭제할 수 있습니다.
            </Box>
            <Editor
              ref={editorRef}
              initialValue=""
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut
              hideModeSwitch
              placeholder="내용을 입력하세요"
            />
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
