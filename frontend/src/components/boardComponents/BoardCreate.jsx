import React, { useState, useRef } from "react";
import { Box, Heading, Input, Button, FormControl, FormLabel, VStack, useToast, Flex, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser} from "@/redux/useUser.js";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const BoardCreate = () => {
  const { state: user } = useUser();
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const SUBJECT_LIST = ["일반", "음악", "후기", "정보", "질문"];
  const [subject, setSubject] = useState(SUBJECT_LIST[0]);

  const editorRef = useRef();

  // 이미지 업로드 관련
  const [images, setImages] = useState([]); // 파일 객체 배열
  const [previews, setPreviews] = useState([]); // 미리보기 url 배열
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = editorRef.current?.getInstance().getMarkdown() || "";

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const data = {
        title,
        content,
        memberId: user.memberId,
        nickname: user.nickname,
        subject,
      };
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: "application/json" });
      formData.append("data", blob);

      // 추가 이미지가 있으면 함께 전송
      images.forEach((img) => formData.append("images", img));

      await axios.post("/api/board/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "게시글이 등록되었습니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      navigate("/board");
    } catch (err) {
      console.log(err);
    }
    setIsSubmitting(false);
  };

  // 이미지 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

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
            <FormLabel>사진 추가</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <Button onClick={() => fileInputRef.current.click()}>사진 선택</Button>
            <Flex mt={2} wrap="wrap" gap={2}>
              {previews.map((url, idx) => (
                <Box key={idx} pos="relative">
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                  <Button
                    size="xs"
                    colorScheme="red"
                    pos="absolute"
                    top={-2}
                    right={-2}
                    borderRadius="full"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Flex>
          </FormControl>
          <Box fontSize="sm" color="gray.500" mb={2}>
            업로드 한 이미지를 본문에 삽입하려면, 드래그로 끌어다 넣어주세요.
          </Box>

          <Box maxW="700px" mx="auto" py={10} px={4}>
            <FormControl>
              <FormLabel>내용</FormLabel>

              <Box fontSize="sm" color="gray.500" mb={2}>
                이미지를 삭제하려면, Backspace 키로 지워주세요.
              </Box>

              <Editor
                ref={editorRef}
                initialValue=""
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                hideModeSwitch={true}
                // placeholder=""
              />
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
