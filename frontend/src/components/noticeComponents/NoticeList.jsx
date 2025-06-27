import React, { useEffect, useState } from "react";
import { Box, Heading, Flex, Text, SimpleGrid, Card, CardBody, Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const NOTICES_PER_PAGE = 6;

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
  const { state: user } = useUser();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`/api/notices`); //전체 목록 가져오기
        setNotices(res.data);
      } catch (err) {
        console.error("공지 목록 조회 실패:", err);
      }
    };
    fetchNotices();
  }, []);

  const totalPages = Math.ceil(notices.length / NOTICES_PER_PAGE);
  const startIndex = page * NOTICES_PER_PAGE;
  const currentNotices = notices.slice(startIndex, startIndex + NOTICES_PER_PAGE);

  return (
    <Box p={6} maxW="1000px" mx="auto">
      <Flex justify="space-between" mb={6} align="center">
        {user?.roleName === "admin" && (
          <Button colorScheme="blue" size="sm" onClick={() => navigate("/notice/create")}>
            글 작성
          </Button>
        )}
      </Flex>

      <SimpleGrid spacing={4}>
        {currentNotices.map((notice) => {
          return (
            <Card
              key={notice.id}
              borderRadius="lg"
              _hover={{ shadow: "md", cursor: "pointer" }}
              onClick={() => {
                navigate(`/notice/${notice.id}`);
              }}
            >
              <CardBody>
                <Text fontSize="lg" fontWeight="bold">
                  {notice.title}
                </Text>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>
      {/* 페이지네이션 */}
      <HStack spacing={2} justify="center" mt={8}>
        <Button size="sm" onClick={() => setPage((prev) => Math.max(prev - 1, 0))} isDisabled={page === 0}>
          이전
        </Button>

        {[...Array(totalPages)].map((_, i) => (
          <Button key={i} size="sm" variant={i === page ? "solid" : "outline"} onClick={() => setPage(i)}>
            {i + 1}
          </Button>
        ))}

        <Button
          size="sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          isDisabled={page >= totalPages - 1}
        >
          다음
        </Button>
      </HStack>
    </Box>
  );
};

export default NoticeList;
