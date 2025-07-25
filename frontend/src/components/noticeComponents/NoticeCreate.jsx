import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, Heading, useToast, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NoticeCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
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

  // 파일 선택 및 미리보기
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);
    setImagePreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !imageFile) {
      toast({
        title: "모든 항목을 입력해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", imageFile);

      await axios.post("/api/notices/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

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
        공지 작성
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>대표 이미지</FormLabel>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreviewUrl && (
            <Image src={imagePreviewUrl} alt="대표 이미지 미리보기" boxSize="200px" mt={2} borderRadius="md" />
          )}
        </FormControl>

        <FormControl mb={4} isRequired>
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
