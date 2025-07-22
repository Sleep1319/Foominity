import React, { useEffect, useState } from "react";
import { Box, Flex, VStack, Text, Button, SimpleGrid, useBreakpointValue, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const NOTICES_PER_PAGE = 20;
  const navigate = useNavigate();
  const { state: user } = useUser();

  // 1. 페이지 먼저 복원
  useEffect(() => {
    const savedPage = sessionStorage.getItem("noticeListPage");
    if (savedPage !== null) {
      setPage(Number(savedPage));
      sessionStorage.removeItem("noticeListPage");
    }
  }, []);

  // 2. 데이터 로드
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

  // 3. 데이터+페이지 세팅 후 스크롤 복원
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

  // 4. 리스트 클릭 시 스크롤 위치와 페이지 저장 후 상세 이동
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
            <Box w="100%" h="550px" bg="gray.300" mb={6} borderRadius="md" />
            <Text
              fontSize="3xl"
              fontWeight="extrabold"
              fontFamily="Georgia"
              mb={4}
              lineHeight="short"
              letterSpacing="-0.5px"
              _hover={{ textDecoration: "underline" }}
            >
              {main.title}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {formatDate(main.createdDate)}
            </Text>
          </Box>
        )}
        <VStack flex="1" spacing={10}>
          {sideNotices.map((notice) => (
            <Box key={notice.id} w="100%" onClick={() => handleNoticeClick(notice.id)} _hover={{ cursor: "pointer" }}>
              <Box w="100%" h="250px" bg="gray.200" mb={4} borderRadius="md" />
              <Text
                fontSize="xl"
                fontWeight="bold"
                fontFamily="Georgia"
                mb={2}
                letterSpacing="-0.4px"
                noOfLines={2}
                _hover={{ textDecoration: "underline" }}
              >
                {notice.title}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {formatDate(notice.createdDate)}
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
              <Box w="100%" h="200px" bg="gray.100" mb={4} borderRadius="md" />
              <Text
                fontSize="lg"
                fontWeight="semibold"
                fontFamily="Georgia"
                mb={2}
                noOfLines={3}
                _hover={{ textDecoration: "underline" }}
              >
                {notice.title}
              </Text>
              <Text fontSize="sm" color="gray.600" mt="auto">
                {formatDate(notice.createdDate)}
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
            cursor="pointer"
            _hover={{}}
            _active={{}}
            _disabled={{ opacity: 0.5 }}
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
              cursor="pointer"
              _hover={{}}
              _active={{}}
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
            cursor="pointer"
            _hover={{}}
            _active={{}}
            _disabled={{ opacity: 0.5 }}
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
