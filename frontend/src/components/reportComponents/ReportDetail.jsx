import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: user } = useUser();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/api/report/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error("리포트 조회 실패:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "리포트 조회 중 오류가 발생했습니다.";

        toast({
          title: "리포트 조회 실패",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/report/${id}`, { withCredentials: true });
      toast({ title: "삭제되었습니다.", status: "success" });
      setTimeout(() => navigate("/report"), 800);
    } catch (err) {
      console.error("리포트 삭제 실패:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "리포트 삭제 중 오류가 발생했습니다.";

      toast({
        title: "삭제 실패",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!report) return null;

  return (
    <Box maxW="800px" mx="auto" py={10} px={4}>
      <Heading size="lg" mb={6}>신고 상세</Heading>

      <Text fontSize="md" mb={2}><strong>신고 ID:</strong> {report.id}</Text>
      <Text fontSize="md" mb={2}><strong>신고자 ID:</strong> {report.memberId}</Text>
      <Text fontSize="md" mb={2}><strong>대상 ID:</strong> {report.targetId}</Text>
      <Text fontSize="md" mb={2}><strong>게시판 종류:</strong> {report.targetType}</Text>

      {user?.id === report.memberId && (
        <Flex gap={4} mt={8}>
          <Button colorScheme="red" onClick={handleDelete}>
            삭제
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default ReportDetail;
