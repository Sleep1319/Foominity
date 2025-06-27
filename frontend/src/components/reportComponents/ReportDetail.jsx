import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Spinner, useToast, Flex, Divider } from "@chakra-ui/react";
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
        const message = err.response?.data?.message || err.message || "리포트 조회 중 오류가 발생했습니다.";
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
      const message = err.response?.data?.message || err.message || "리포트 삭제 중 오류가 발생했습니다.";
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
    <>
      <Text fontSize="4xl" fontWeight="bold" textAlign="center" mt={10} color="black">
        Report
      </Text>

      <Flex justify="center" align="center" minH="70vh">
        <Box w="full" maxW="600px" bg="white" p={10} border="1px solid" borderColor="gray.200">
          <Heading size="md" mb={6} color="black" borderBottom="1px solid #ddd" pb={2}>
            신고 상세 정보
          </Heading>

          <Box mb={4}>
            <Text mb={1} fontWeight="semibold" color="gray.700">
              신고 ID:
            </Text>
            <Text color="gray.900">{report.id}</Text>
          </Box>

          <Box mb={4}>
            <Text mb={1} fontWeight="semibold" color="gray.700">
              신고자 ID:
            </Text>
            <Text color="gray.900">{report.memberId}</Text>
          </Box>

          <Box mb={4}>
            <Text mb={1} fontWeight="semibold" color="gray.700">
              신고 대상 ID:
            </Text>
            <Text color="gray.900">{report.targetId}</Text>
          </Box>

          <Box mb={4}>
            <Text mb={1} fontWeight="semibold" color="gray.700">
              게시판 종류:
            </Text>
            <Text color="gray.900">{report.targetType}</Text>
          </Box>

          {user?.id === report.memberId && (
            <Flex mt={8} justify="flex-end">
              <Button colorScheme="blackAlpha" variant="outline" onClick={handleDelete}>
                삭제
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default ReportDetail;
