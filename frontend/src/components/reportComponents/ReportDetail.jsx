import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  useToast,
  Flex,
  Divider,
  Icon,
  Spacer,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser} from "@/redux/useUser.js";
import ReportCommentForm from "../commentComponents/ReportCommentForm";
import CommentList from "../commentComponents/CommentList";

const getTypeLabel = (type) => {
  switch (type) {
    case "REPORT":
      return "신고";
    case "INQUIRY":
      return "문의";
    case "REQUEST":
      return "요청";
    case "SUGGESTION":
      return "건의";
    default:
      return "기타";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "대기 중";
    case "IN_PROGRESS":
      return "처리 중";
    case "RESOLVED":
      return "처리 완료";
    case "REJECTED":
      return "거절됨";
    default:
      return "알수없음";
  }
};

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

const statusOptions = [
  { value: "PENDING", label: "대기 중" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "RESOLVED", label: "처리 완료" },
  { value: "REJECTED", label: "거절됨" },
];

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  // const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const toast = useToast();
  const { state: user } = useUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/report/${id}`, { withCredentials: true });
      toast({
        title: "게시물 삭제 완료",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/report");
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/api/report/${id}`, { withCredentials: true });
        setReport(res.data);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        toast({
          title: "글 조회 실패",
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
  }, [id, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleStatusSelect = async (selectedStatus) => {
    setStatusLoading(true);
    try {
      await axios.put(`/api/report/${id}/status`, { status: selectedStatus }, { withCredentials: true });
      setReport((prev) => ({ ...prev, status: selectedStatus }));
      toast({
        title: "상태가 변경되었습니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "상태 변경 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setStatusLoading(false);
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

  const typeLabel = getTypeLabel(report.type);

  return (
    <Box p={8} maxW="900px" mx="auto" mt="120px" bg="white">
      <Heading size="lg" mb={6} textAlign="center">
        {typeLabel} 상세 내역
      </Heading>
      <Flex justify="space-between" align="center" mb={6}>
        <Text color="gray.600" fontSize="md">
          {formatDate(report.createdDate)}
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex mb={3} align="center">
        <Text fontWeight="semibold" minW="120px" fontSize="md">
          작성자 닉네임
        </Text>
        <Text fontSize="md">{report.nickname}</Text>
        <Spacer />
        <Box>
          {user?.roleName === "ADMIN" ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="sm"
                isLoading={statusLoading}
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                fontWeight="semibold"
                borderRadius="999px"
              >
                {statusOptions.find((opt) => opt.value === report.status)?.label || "상태 선택"}
              </MenuButton>
              <MenuList>
                {statusOptions.map(({ value, label }) => (
                  <MenuItem key={value} onClick={() => handleStatusSelect(value)}>
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <Text
              fontSize="sm"
              px={4}
              py={1}
              bg="black"
              color="white"
              borderRadius="full"
              fontWeight="bold"
              display="inline-block"
              minWidth="70px"
              textAlign="center"
            >
              {getStatusLabel(report.status)}
            </Text>
          )}
        </Box>
      </Flex>
      {report.type === "REPORT" && (
        <>
          <Flex mb={3}>
            <Text fontWeight="semibold" minW="120px">
              신고 대상 번호
            </Text>
            <Text>{report.targetId}</Text>
          </Flex>
          <Flex mb={3}>
            <Text fontWeight="semibold" minW="120px">
              게시판 종류
            </Text>
            <Text>{getTargetTypeLabel(report.targetType)}</Text>
          </Flex>
        </>
      )}
      <Divider my={4} />
      <Text fontWeight="semibold" mb={2} fontSize="lg">
        제목
      </Text>
      <Box bg="gray.50" px={5} py={3} borderRadius="md" mb={5}>
        <Text fontSize="xl">{report.title}</Text>
      </Box>
      <Text fontWeight="semibold" mb={2} fontSize="lg">
        {typeLabel} 내용
      </Text>
      <Box bg="gray.50" px={5} py={3} borderRadius="md" whiteSpace="pre-wrap" mb={8}>
        <Text fontSize="md">{report.reason}</Text>
      </Box>
      <Flex justify="flex-end" gap={2} mt={6}>
        <Button
          color="white"
          bg="black"
          size="sm"
          fontSize="sm"
          _hover={{ bg: "black", color: "white" }}
          onClick={() => navigate("/report")}
        >
          목록
        </Button>
        {user?.roleName === "ADMIN" && (
          <>
            <Button color="white" bg="red.500" size="sm" fontSize="sm" _hover={{ bg: "red.600" }} onClick={onOpen}>
              삭제
            </Button>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    게시물 삭제
                  </AlertDialogHeader>
                  <AlertDialogBody>해당 게시물을 정말 삭제하시겠습니까?</AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      취소
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} ml={3}>
                      삭제
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </Flex>

      {/* --- 댓글 리스트 --- */}
      {/* <Divider my={12} />
      <Box px={2}>
        <CommentList type="reports" id={report.id} key={commentRefreshKey} />
      </Box> */}
      {/* --- 댓글 작성 폼 --- */}
      {/* <Box px={2} mt={2}>
        <ReportCommentForm reportId={report.id} onSuccess={() => setCommentRefreshKey((k) => k + 1)} />
      </Box> */}
    </Box>
  );
};

export default ReportDetail;
