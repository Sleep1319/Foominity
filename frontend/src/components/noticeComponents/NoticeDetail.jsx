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
        const message =
          err.response?.data?.message ||
          err.message ||
          "공지 조회 중 오류가 발생했습니다.";

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
      const message =
        err.response?.data?.message ||
        err.message ||
        "삭제 중 오류가 발생했습니다.";

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
      const message =
        err.response?.data?.message ||
        err.message ||
        "메인 설정 중 오류가 발생했습니다.";

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
    <Box maxW="800px" mx="auto" py={10} px={4}>
      <Heading size="lg" mb={6}>
        {notice.title}
      </Heading>
      <Text fontSize="md" whiteSpace="pre-line" mb={12}>
        {notice.content}
      </Text>

      {user?.role === "ADMIN" && (
        <Flex gap={4}>
          <Button colorScheme="red" onClick={handleDelete}>
            삭제
          </Button>
          <Button colorScheme="blue" onClick={handleSetMain}>
            메인공지로 설정
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default NoticeDetail;
