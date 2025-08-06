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
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [readMore, setReadMore] = useState([]);
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

    const fetchReadMore = async () => {
      try {
        const res = await axios.get("/api/notices", { withCredentials: true });
        const list = res.data.filter((n) => String(n.id) !== String(id)).slice(0, 16);
        setReadMore(list);
      } catch (err) {
        console.error("Read More fetch 실패:", err);
      }
    };

    fetchNotice();
    fetchReadMore();
  }, [id, toast]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

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

  const summary = notice?.summary;
  const displayDate = notice.publishedDate || notice.createdDate;

  return (
    <>
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
          mb={2}
          lineHeight="1.3"
          letterSpacing="-0.5px"
        >
          {notice.title}
        </Heading>

        <Box w="20%" h="2px" bg="red" mb={6} />

        {summary && (
          <Text fontSize="md" fontWeight="medium" color="gray.600" mb={6}>
            {summary}
          </Text>
        )}

        <Text fontSize="sm" color="gray.500" mb={8}>
          발행일 : {new Date(displayDate).toLocaleDateString("ko-KR")}
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

        {notice.originalUrl && (
          <Box mt={10} mb={16}>
            <Text fontSize="sm" color="gray.500" mb={1}>
              원문 링크
            </Text>
            <Box px={4} py={2} border="1px solid" borderColor="gray.200" borderRadius="md">
              <a
                href={notice.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3182ce", textDecoration: "underline" }}
              >
                {notice.originalUrl}
              </a>
            </Box>
          </Box>
        )}
      </Box>

      {readMore.length > 0 && (
        <Box maxW="1600px" mx="auto" px={{ base: 4, md: 8 }} mt={20}>
          <Box w="100%" h="2px" bg="black" mb={5} />
          <Text fontSize="3xl" fontWeight="extrabold" textAlign="center" fontFamily="Georgia" mb={5}>
            Read More
          </Text>
          <Box w="100%" h="2px" bg="black" mb={10} />

          <SimpleGrid columns={[1, 2, 4]} spacing={10}>
            {readMore.map((item) => (
              <Box
                key={item.id}
                onClick={() => navigate(`/notice/${item.id}`)}
                _hover={{ cursor: "pointer" }}
                display="flex"
                flexDirection="column"
                minH="320px"
                pb={6}
              >
                {item.imagePath ? (
                  <Box w="100%" h="230px" mb={4} borderRadius="md" overflow="hidden">
                    <Image
                      src={`http://localhost:8084/${item.imagePath}`}
                      alt={item.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                ) : (
                  <Box w="100%" h="230px" bg="gray.100" mb={4} borderRadius="md" />
                )}
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  fontFamily="Georgia"
                  mb={1}
                  noOfLines={2}
                  _hover={{ textDecoration: "underline" }}
                >
                  {item.title}
                </Text>
                <Text fontSize="sm" color="gray.600" mt="auto">
                  {formatDate(item.publishedDate || item.createdDate)}
                </Text>

                <Box w="40%" h="1px" bg="red" mt={4} ml="0" />
              </Box>
            ))}
          </SimpleGrid>

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
      )}
    </>
  );
};

export default NoticeDetail;
