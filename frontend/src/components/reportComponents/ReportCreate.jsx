import React, { useState, useEffect } from "react";
import { Box, Heading, FormControl, FormLabel, Input, Textarea, Button, Select, useToast } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const typeOptions = [
  { value: "REPORT", label: "신고 (불건전/광고/기타)" },
  { value: "INQUIRY", label: "문의 (사이트 이용/계정 관련/기타)" },
  { value: "REQUEST", label: "요청  (기능 추가/컨텐츠 요청)" },
  { value: "SUGGESTION", label: "건의 (UI/UX 개선, 정책/운영 건의)" },
];

// **comment case 제거**
const getTargetTypeLabel = (targetType) => {
  switch (targetType) {
    case "BOARD":
      return "자유게시판";
    case "REVIEW":
      return "리뷰게시판";
    case "REPORT":
      return "신고게시판";
    default:
      return targetType || "-";
  }
};

const ReportCreate = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("targetId") || "";
  const initialTargetType = searchParams.get("targetType") || "";

  const [type, setType] = useState("REPORT");
  const [targetId, setTargetId] = useState("");
  const [targetType, setTargetType] = useState("");
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "REPORT") {
      if (initialId) setTargetId(initialId);
      if (initialTargetType) setTargetType(initialTargetType);
    } else {
      setTargetId("");
      setTargetType("");
    }
  }, [initialId, initialTargetType, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "REPORT" && (!targetId || !targetType)) {
      toast({ title: "신고 대상 번호와 종류를 입력해주세요.", status: "warning", duration: 2000 });
      return;
    }
    if (!title.trim() || !reason.trim()) {
      toast({ title: "제목과 내용을 입력해주세요.", status: "warning", duration: 2000 });
      return;
    }

    try {
      await axios.post(
        "/api/report/add",
        {
          type,
          targetId: type === "REPORT" ? Number(targetId) : null,
          targetType: type === "REPORT" ? targetType : null,
          title,
          reason,
        },
        { withCredentials: true }
      );
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
        {type === "REPORT" && targetId && targetType && (
          <>
            <FormControl mb={4} isReadOnly>
              <FormLabel>신고 대상 번호</FormLabel>
              <Input value={targetId} isReadOnly />
            </FormControl>
            <FormControl mb={4} isReadOnly>
              <FormLabel>신고 대상 종류</FormLabel>
              <Input value={getTargetTypeLabel(targetType)} isReadOnly />
            </FormControl>
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
        <Button
          type="submit"
          color="white"
          bg="black"
          size="sm"
          fontSize="sm"
          _hover={{ bg: "black", color: "white" }}
          mr={2}
        >
          {type === "REPORT" ? "신고하기" : "등록"}
        </Button>
        <Button size="sm" fontSize="sm" _hover={{}} onClick={() => navigate(-1)}>
          취소
        </Button>
      </form>
    </Box>
  );
};

export default ReportCreate;
