import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  useToast,
  IconButton,
  Image,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const typeOptions = [
  { value: "REPORT", label: "신고 (불건전/광고/기타)" },
  { value: "INQUIRY", label: "문의 (사이트 이용/계정 관련/기타)" },
  { value: "REQUEST", label: "요청  (기능 추가/컨텐츠 요청)" },
  { value: "SUGGESTION", label: "건의 (UI/UX 개선, 정책/운영 건의)" },
];

// 신고 대상 종류 (번호 입력 없음)
const targetTypeOptions = [
  { value: "BOARD", label: "자유게시판" },
  { value: "REVIEW", label: "리뷰게시판" },
];

const getTargetTypeLabel = (targetType) => {
  switch (targetType) {
    case "BOARD":
      return "자유게시판";
    case "REVIEW":
      return "리뷰게시판";
    default:
      return targetType || "-";
  }
};

const ReportCreate = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("targetId") || ""; // 게시글 상세에서 넘어온 경우만 존재
  const initialTargetType = searchParams.get("targetType") || ""; // 게시글 상세에서 넘어온 경우만 존재

  const [type, setType] = useState("REPORT");
  const [targetType, setTargetType] = useState(""); // ✅ 번호 대신 게시판만 선택
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "REPORT") {
      // 상세에서 넘어온 경우 게시판 종류는 초기화
      if (initialTargetType) setTargetType(initialTargetType);
    } else {
      setTargetType("");
    }
  }, [initialTargetType, type]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "REPORT" && !targetType) {
      toast({ title: "신고 대상 게시판을 선택해주세요.", status: "warning", duration: 2000 });
      return;
    }
    if (!title.trim() || !reason.trim()) {
      toast({ title: "제목과 내용을 입력해주세요.", status: "warning", duration: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append("type", type);

    if (type === "REPORT") {
      // ✅ 번호는 전송하지 않음. (상세에서 넘어온 경우에만 백엔드로 targetId 추가 전송)
      formData.append("targetType", targetType);
      if (initialId) formData.append("targetId", initialId);
    }

    formData.append("title", title);
    formData.append("reason", reason);
    images.forEach((file) => formData.append("images", file));

    try {
      await axios.post("/api/report/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "등록이 완료되었습니다.", status: "success", duration: 2000 });
      navigate("/report");
    } catch (error) {
      toast({
        title: "등록 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={24} p={4}>
      <Heading size="lg" mb={6}>
        {type === "REPORT"
          ? "신고 작성"
          : type === "INQUIRY"
          ? "문의 작성"
          : type === "REQUEST"
          ? "요청 작성"
          : "건의 작성"}
      </Heading>

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>유형</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* ✅ REPORT일 때: 게시판만 선택 (상세에서 넘어오면 읽기 전용으로 표시) */}
        {type === "REPORT" && (
          <>
            {initialTargetType ? (
              // 상세에서 넘어온 케이스: 게시판만 표시(읽기 전용)
              <FormControl mb={4} isReadOnly>
                <FormLabel>신고 대상 게시판</FormLabel>
                <Input value={getTargetTypeLabel(initialTargetType)} isReadOnly />
              </FormControl>
            ) : (
              // 게시판에서 "신고하기"로 온 케이스: 게시판 선택만
              <FormControl mb={4} isRequired>
                <FormLabel>신고 대상 게시판</FormLabel>
                <Select
                  placeholder="게시판 종류를 선택하세요"
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                >
                  {targetTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}

        <FormControl mb={4} isRequired>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl mb={6} isRequired>
          <FormLabel>
            {type === "REPORT"
              ? "신고 내용"
              : type === "INQUIRY"
              ? "문의 내용"
              : type === "REQUEST"
              ? "요청 내용"
              : "건의 내용"}
          </FormLabel>
          <Textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`${typeOptions.find((opt) => opt.value === type)?.label} 내용을 입력해주세요.`}
          />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>이미지 첨부</FormLabel>
          <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <Wrap mt={3}>
            {images.map((file, idx) => (
              <WrapItem key={idx} position="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <IconButton
                  aria-label="remove-image"
                  icon={<CloseIcon />}
                  size="xs"
                  position="absolute"
                  top="0"
                  right="0"
                  colorScheme="red"
                  onClick={() => removeImage(idx)}
                />
              </WrapItem>
            ))}
          </Wrap>
        </FormControl>

        <Button type="submit" color="white" bg="black" size="sm" _hover={{ bg: "black" }} mr={2}>
          {type === "REPORT" ? "신고하기" : "등록"}
        </Button>
        <Button size="sm" onClick={() => navigate(-1)}>
          취소
        </Button>
      </form>
    </Box>
  );
};

export default ReportCreate;
