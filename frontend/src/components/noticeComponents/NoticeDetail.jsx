import {
  Box,
  Heading,
  Text,
  Spinner,
  useToast,
  Flex,
  VStack,
  Button,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { state: user } = useUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/notices/${id}`, { withCredentials: true });
      toast({
        title: "공지 삭제 완료",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/notice");
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
    const fetchNotice = async () => {
      try {
        const res = await axios.get(`/api/notices/${id}`, { withCredentials: true });
        setNotice(res.data);
      } catch (err) {
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
  }, [id, toast]);

  if (loading) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!notice)
    return (
      <Text textAlign="center" mt={10}>
        공지 정보를 찾을 수 없습니다.
      </Text>
    );

  return (
    <Box maxW="900px" mx="auto" px={{ base: 4, md: 8 }} py={16} mt={16}>
      <Link as={RouterLink} to="/notice" _hover={{ textDecoration: "underline" }}>
        <Text fontSize="sm" fontWeight="bold" color="black" mb={3} textTransform="uppercase">
          Magazine
        </Text>
      </Link>

      <Heading
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight="extrabold"
        fontFamily="Georgia"
        mb={5}
        lineHeight="1.3"
        letterSpacing="-0.5px"
      >
        {notice.title}
      </Heading>

      <Box w="20%" h="2px" bg="red" mb={6} />

      <Text fontSize="sm" color="gray.500" mb={8}>
        {new Date(notice.createdDate).toLocaleDateString("ko-KR")}
      </Text>

      {notice.imagePath ? (
        <Box mb={10}>
          <img
            src={`http://localhost:8084/${notice.imagePath}`}
            alt={notice.title}
            style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 8 }}
          />
        </Box>
      ) : (
        <Box w="100%" h="420px" bg="gray.100" borderRadius="md" mb={10} />
      )}

      <VStack spacing={6} align="stretch">
        <Text fontSize="md" whiteSpace="pre-line" color="gray.800" lineHeight="1.8" textAlign="left">
          {notice.content}
        </Text>
      </VStack>

      <Flex justify="flex-end" mt={12} gap={3}>
        <Button
          color="white"
          bg="black"
          size="sm"
          fontSize="sm"
          _hover={{ bg: "black", color: "white" }}
          onClick={() => navigate("/notice")}
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
    </Box>
  );
};

export default NoticeDetail;
