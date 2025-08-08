import React, { useEffect, useState } from "react";
import { Box, Flex, VStack, Text, Button, SimpleGrid, useBreakpointValue, HStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser} from "@/redux/useUser.js";

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const NOTICES_PER_PAGE = 20;
  const navigate = useNavigate();
  const { state: user } = useUser();

  useEffect(() => {
    const savedPage = sessionStorage.getItem("noticeListPage");
    if (savedPage !== null) {
      setPage(Number(savedPage));
      sessionStorage.removeItem("noticeListPage");
    }
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("/api/notices");
        setNotices(res.data);
      } catch (err) {
        console.error("공지 목록 조회 실패:", err);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    if (notices.length > 0) {
      const savedY = sessionStorage.getItem("noticeScrollY");
      if (savedY) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedY, 10));
          sessionStorage.removeItem("noticeScrollY");
        }, 0);
      }
    }
  }, [notices, page]);

  const handleNoticeClick = (noticeId) => {
    sessionStorage.setItem("noticeScrollY", window.scrollY);
    sessionStorage.setItem("noticeListPage", page);
    navigate(`/notice/${noticeId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const [main, ...rest] = notices;
  const sideNotices = rest.slice(0, 2);
  const gridNotices = rest.slice(2);
  const totalPages = Math.ceil(gridNotices.length / NOTICES_PER_PAGE);
  const currentGridNotices = gridNotices.slice(page * NOTICES_PER_PAGE, (page + 1) * NOTICES_PER_PAGE);

  return (
    <Box px={{ base: 4, md: 16 }} pt={10} maxW="1600px" mx="auto">
      <Flex justify="space-between" mb={4} align="center">
        {user?.roleName === "ADMIN" && (
          <Button
            color="white"
            bg="black"
            size="sm"
            fontSize="sm"
            _hover={{ bg: "black", color: "white" }}
            onClick={() => navigate("/notice/create")}
          >
            글 작성
          </Button>
        )}
      </Flex>

      <Flex direction={useBreakpointValue({ base: "column", md: "row" })} gap={14}>
        {main && (
          <Box flex="2" onClick={() => handleNoticeClick(main.id)} _hover={{ cursor: "pointer" }}>
            {main.imagePath ? (
              <Box w="100%" h="550px" mb={6} borderRadius="md" overflow="hidden">
                <Image
                  src={`http://localhost:8084/${main.imagePath}`}
                  alt="공지 이미지"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  borderRadius="md"
                />
              </Box>
            ) : (
              <Box w="100%" h="550px" bg="gray.300" mb={6} borderRadius="md" />
            )}
            <Text
              fontSize="3xl"
              fontWeight="extrabold"
              fontFamily="Georgia"
              mb={2}
              lineHeight="short"
              letterSpacing="-0.5px"
              _hover={{ textDecoration: "underline" }}
            >
              {main.title}
            </Text>
            {main.summary && (
              <Text fontSize="md" color="gray.600" mb={4}>
                {main.summary}
              </Text>
            )}
            <Text fontSize="sm" color="gray.600">
              {formatDate(main.publishedDate || main.createdDate)}
            </Text>
          </Box>
        )}

        <VStack flex="1" spacing={10}>
          {sideNotices.map((notice) => (
            <Box key={notice.id} w="100%" onClick={() => handleNoticeClick(notice.id)} _hover={{ cursor: "pointer" }}>
              {notice.imagePath ? (
                <Box w="100%" h="250px" mb={4} borderRadius="md" overflow="hidden">
                  <Image
                    src={`http://localhost:8084/${notice.imagePath}`}
                    alt="매거진 이미지"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Box>
              ) : (
                <Box w="100%" h="250px" bg="gray.200" mb={4} borderRadius="md" />
              )}
              <Text
                fontSize="xl"
                fontWeight="bold"
                fontFamily="Georgia"
                mb={1}
                letterSpacing="-0.4px"
                noOfLines={2}
                _hover={{ textDecoration: "underline" }}
              >
                {notice.title}
              </Text>
              {notice.summary && (
                <Text fontSize="sm" color="gray.500" noOfLines={2} mb={1}>
                  {notice.summary}
                </Text>
              )}
              <Text fontSize="sm" color="gray.600">
                {formatDate(notice.publishedDate || notice.createdDate)}
              </Text>
            </Box>
          ))}
        </VStack>
      </Flex>

      <Box mt={20}>
        <Box w="100%" h="1px" bg="gray.400" my={16} />
        <SimpleGrid columns={[1, null, 3]} spacing={10}>
          {currentGridNotices.map((notice) => (
            <Box
              key={notice.id}
              onClick={() => handleNoticeClick(notice.id)}
              _hover={{ cursor: "pointer" }}
              display="flex"
              flexDirection="column"
              minH="320px"
              pb={6}
              borderBottom="1px solid black"
            >
              {notice.imagePath ? (
                <Box w="100%" h="230px" mb={4} borderRadius="md" overflow="hidden">
                  <Image
                    src={`http://localhost:8084/${notice.imagePath}`}
                    alt="매거진 이미지"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Box>
              ) : (
                <Box w="100%" h="200px" bg="gray.100" mb={4} borderRadius="md" />
              )}
              <Text
                fontSize="lg"
                fontWeight="semibold"
                fontFamily="Georgia"
                mb={1}
                noOfLines={2}
                _hover={{ textDecoration: "underline" }}
              >
                {notice.title}
              </Text>
              {notice.summary && (
                <Text fontSize="sm" color="gray.500" noOfLines={2} mb={1}>
                  {notice.summary}
                </Text>
              )}
              <Text fontSize="sm" color="gray.600" mt="auto">
                {formatDate(notice.publishedDate || notice.createdDate)}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <HStack spacing={2} justify="center" mt={12}>
          <Button
            size="sm"
            bg="white"
            color="black"
            border="1px solid black"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            isDisabled={page === 0}
          >
            이전
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              bg={i === page ? "black" : "white"}
              color={i === page ? "white" : "black"}
              border="1px solid black"
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            size="sm"
            bg="white"
            color="black"
            border="1px solid black"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            isDisabled={page >= totalPages - 1}
          >
            다음
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default NoticeList;
