import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Spinner, useToast, Flex, Divider, HStack } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: user } = useUser();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get(`/api/notices/${id}`);
        setNotice(res.data);
      } catch (err) {
        console.error("공지 불러오기 실패:", err);
        const message = err.response?.data?.message || err.message || "공지 조회 중 오류가 발생했습니다.";
        toast({
          title: "공지 조회 실패",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/notice/${id}`, { withCredentials: true });
      toast({ title: "삭제되었습니다.", status: "success" });
      setTimeout(() => navigate("/notice"), 800);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "삭제 중 오류가 발생했습니다.";
      toast({
        title: "삭제 실패",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSetMain = async () => {
    try {
      await axios.post(`/api/notice/main/${id}`, null, { withCredentials: true });
      toast({ title: "메인 공지로 설정됨", status: "success" });
    } catch (err) {
      const message = err.response?.data?.message || err.message || "메인 설정 중 오류가 발생했습니다.";
      toast({
        title: "메인 설정 실패",
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
  if (!notice) return null;

  return (
    <>
      <Text fontSize="4xl" fontWeight="bold" textAlign="center" mt={10} color="black">
        NOTICE
      </Text>

      <Flex justify="center" align="center" minH="70vh" mt={8} mb={59}>
        <Box w="full" maxW="600px" bg="white" p={10} borderRadius="xl" border="1px solid" borderColor="gray.200">
          <Heading size="md" mb={6} color="black" borderBottom="1px solid #ddd" pb={2}>
            <HStack>
              <Text mb={1} fontWeight="semibold" color="gray.700">
                제목:
              </Text>
              <Text color="gray.900">{notice.title}</Text>
            </HStack>
          </Heading>

          <Box mb={4}></Box>

          <Box mb={4}>
            <Text whiteSpace="pre-line" color="gray.900">
              {notice.content}
            </Text>
          </Box>

          {user?.role === "ADMIN" && (
            <Flex mt={8} gap={4} justify="flex-end">
              <Button colorScheme="red" variant="outline" onClick={handleDelete}>
                삭제
              </Button>
              <Button colorScheme="blue" variant="outline" onClick={handleSetMain}>
                메인공지 설정
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default NoticeDetail;
