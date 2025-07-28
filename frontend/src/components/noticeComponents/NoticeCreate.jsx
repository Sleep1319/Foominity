import React, { useRef, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, Heading, useToast, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import CropperModal from "./CropperModal";

const NoticeCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [rawImage, setRawImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const fileInputRef = useRef();

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setRawImage(previewURL);
    setIsCropOpen(true);
  };

  const handleCropComplete = (blob) => {
    const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
    setImageFile(croppedFile);
    setImagePreviewUrl(URL.createObjectURL(blob));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl("");
    setRawImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRecrop = () => {
    if (rawImage) {
      setIsCropOpen(true);
    }
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
      navigate("/notice");
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
    <Box maxW="1000px" mx="auto" mt="130px" px={{ base: 4, md: 10 }}>
      <Heading size="lg" mb={6}>
        매거진 작성
      </Heading>

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>대표 이미지</FormLabel>
          <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
          {imagePreviewUrl && (
            <>
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
              <Box mt={2} display="flex" gap={2}>
                <Button size="xs" variant="outline" color="gray.600" onClick={handleRecrop}>
                  다시 자르기
                </Button>
                <Button size="xs" variant="outline" color="gray.600" onClick={handleRemoveImage}>
                  이미지 제거
                </Button>
              </Box>
            </>
          )}
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel display="flex" gap={2}>
            내용
            <Box as="span" fontSize="sm" color="gray.500" fontWeight="normal">
              (첫 문장은 요약 텍스트를 써주세요. 마침표, 물음표, 느낌표 기준)
            </Box>
          </FormLabel>
          <Textarea rows={15} value={content} onChange={(e) => setContent(e.target.value)} />
        </FormControl>

        <Button type="submit" color="white" bg="black" size="sm" fontSize="sm" _hover={{ bg: "black", color: "white" }}>
          등록
        </Button>
      </form>

      <CropperModal
        imageSrc={rawImage}
        isOpen={isCropOpen}
        onClose={() => setIsCropOpen(false)}
        onComplete={handleCropComplete}
      />
    </Box>
  );
};

export default NoticeCreate;
