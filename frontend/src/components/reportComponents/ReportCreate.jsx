import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const ReportCreate = () => {
  const [targetId, setTargetId] = useState("");
  const [targetType, setTargetType] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { state: user } = useUser();

  if (!user) {
    return (
      <Box p={6}>
        <Heading size="md">로그인 후 이용해주세요.</Heading>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!targetId.trim() || !targetType.trim()) {
      toast({
        title: "모든 항목을 입력해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(
        "/api/report/add",
        {
          targetId: parseInt(targetId, 10),
          targetType,
        },
        { withCredentials: true }
      );
      toast({
        title: "신고가 접수되었습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/report");
    } catch (error) {
      console.error("신고 실패:", error);
      toast({
        title: "신고 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={4}>
      <Heading size="lg" mb={6}>신고 작성</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>신고 대상 ID</FormLabel>
          <Input
            type="number"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
        </FormControl>

        <FormControl mb={6} isRequired>
          <FormLabel>신고 게시판</FormLabel>
          <Select
            placeholder="선택하세요"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
          >
            <option value="REVIEW">REVIEW</option>
            <option value="BOARD">BOARD</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="red">
          신고하기
        </Button>
      </form>
    </Box>
  );
};

export default ReportCreate;
