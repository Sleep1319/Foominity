import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  useToast,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NoticeCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keyPoints, setKeyPoints] = useState([]);
  const [summary, setSummary] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();
  const { state: user } = useUser();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("/api/notices/pending", {
          withCredentials: true,
        });

        if (res.status === 204) {
          toast({
            title: "등록할 매거진이 없습니다.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
          navigate("/notice");
          return;
        }

        const { translatedTitle, translatedContent, keyPoints, summary, imageUrl, originalUrl, publishedDate } =
          res.data;

        setTitle(translatedTitle);
        setContent(keyPoints?.join("\n") || translatedContent);
        setKeyPoints(keyPoints || []);
        setSummary(summary || "");
        setImageUrl(imageUrl || "");
        setImagePreviewUrl(imageUrl || "");
        setOriginalUrl(originalUrl || "");
        setPublishedDate(publishedDate);
      } catch (err) {
        toast({
          title: "새로운 매거진 불러오기 실패",
          description: err.response?.data?.message || "오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/notice");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !imageUrl) {
      toast({
        title: "모든 항목을 입력해주세요.",
        description: "이미지는 자동으로 지정된 이미지를 사용하세요.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("summary", summary || content.split(/(?<=[.?!])\s+/)[0]);
      keyPoints.forEach((kp) => formData.append("keyPoints", kp));
      formData.append("originalUrl", originalUrl);
      if (publishedDate) {
        formData.append("publishedDate", publishedDate.slice(0, 10));
      }
      if (imageUrl) {
        formData.append("imagePath", imageUrl);
      }

      await axios.post("/api/notices/publish", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast({
        title: "매거진 등록 완료",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/notice");
    } catch (error) {
      console.error("등록 실패:", error);
      toast({
        title: "등록 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user || user.roleName !== "ADMIN") {
    return (
      <Box p={6}>
        <Heading size="md">접근 권한이 없습니다.</Heading>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={40}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="1000px" mx="auto" mt="130px" px={{ base: 4, md: 10 }}>
      <Heading size="lg" mb={6}>
        매거진 등록
      </Heading>

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        {publishedDate && (
          <FormControl mb={4}>
            <FormLabel>발행일</FormLabel>
            <Input type="date" value={publishedDate.slice(0, 10)} readOnly />
          </FormControl>
        )}

        <FormControl mb={4}>
          <FormLabel>대표 이미지</FormLabel>
          {imagePreviewUrl && (
            <Box
              position="relative"
              width="920px"
              maxW="100%"
              height="500px"
              borderRadius="md"
              overflow="hidden"
              mt={2}
            >
              <Image
                src={imagePreviewUrl}
                alt="대표 이미지 미리보기"
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>
          )}
        </FormControl>

        {summary && (
          <>
            <Text fontSize="md" fontWeight="medium" color="black" mb={1}>
              요약
            </Text>
            <Box mb={4} px={4} py={2} border="1px solid" borderColor="gray.200" borderRadius="md">
              <Text fontSize="md" color="gray.800" whiteSpace="pre-line">
                {summary}
              </Text>
            </Box>
          </>
        )}

        <FormControl mb={4} isRequired>
          <FormLabel display="flex" gap={2}>
            내용
            <Box as="span" fontSize="sm" color="gray.500">
              (AI 핵심 문장 또는 자유롭게 작성)
            </Box>
          </FormLabel>
          <Textarea rows={15} value={content} onChange={(e) => setContent(e.target.value)} />
        </FormControl>

        {originalUrl && (
          <Box mb={4}>
            <Text fontSize="md" fontWeight="medium" color="black" mb={1}>
              원문 링크
            </Text>
            <Box px={4} py={2} border="1px solid" borderColor="gray.200" borderRadius="md">
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3182ce", textDecoration: "underline" }}
              >
                {originalUrl}
              </a>
            </Box>
          </Box>
        )}

        <Button type="submit" color="white" bg="black" size="sm" fontSize="sm" _hover={{ bg: "black" }}>
          등록
        </Button>
      </form>
    </Box>
  );
};

export default NoticeCreate;
