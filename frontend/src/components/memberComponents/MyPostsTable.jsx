import { Table, Thead, Tbody, Tr, Th, Td, Spinner, Box, Text, Button, Flex, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "@/redux/useUser.js";
import axios from "axios";

const MyPostsTable = () => {
  const { state } = useUser();
  const userId = state.id;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태 (기존 로직 유지)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/board/member/${userId}`, { withCredentials: true })
      .then((res) => {
        // ▼ 정렬 추가: 최신글부터
        const sorted = (Array.isArray(res.data) ? [...res.data] : []).sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setPosts(sorted);
      })
      .catch((err) => {
        console.error("내 게시물 조회 실패", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <Flex justify="center" align="center" minH="120px">
        <Spinner />
      </Flex>
    );

  if (posts.length === 0)
    return (
      <Box p={6} maxW="1000px" mx="auto" mt={2}>
        <Text>작성한 게시물이 없습니다.</Text>
      </Box>
    );

  // 총 페이지 수
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 현재 페이지에 보여줄 게시물
  const startIdx = (currentPage - 1) * postsPerPage;
  const paginatedPosts = posts.slice(startIdx, startIdx + postsPerPage);

  return (
    <>
      <Box p={6} maxW="1000px" mx="auto" mt={2}>
        <Table
          variant="simple"
          size="sm"
          sx={{
            tableLayout: "fixed",
            th: { textAlign: "center" },
            td: { textAlign: "center", verticalAlign: "middle" },
            ".title-cell": {
              maxWidth: "240px",
              minWidth: "160px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        >
          <Thead>
            <Tr>
              <Th width="60px">NO</Th>
              <Th className="title-cell">제목</Th>
              <Th width="120px">작성일</Th>
              <Th width="85px">조회수</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedPosts.map((p) => (
              <Tr key={p.id} height="40px">
                <Td>{p.id}</Td>
                {/* <Td>{startIdx + i + 1}</Td> */}
                <Td className="title-cell" textAlign="left">
                  <RouterLink to={`/board/${p.id}`}>
                    <Text fontWeight="bold" _hover={{ textDecoration: "underline" }}>
                      {p.title}
                    </Text>
                  </RouterLink>
                </Td>
                <Td>{new Date(p.createdDate).toLocaleDateString()}</Td>
                <Td>{p.views}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* 페이지네이션 */}
        <HStack spacing={2} justify="center" mt={8}>
          <Button
            size="sm"
            bg="white"
            color="black"
            border="1px solid black"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            isDisabled={currentPage === 1}
          >
            이전
          </Button>

          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <Button
                key={pageNum}
                size="sm"
                bg={pageNum === currentPage ? "black" : "white"}
                color={pageNum === currentPage ? "white" : "black"}
                border="1px solid black"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            size="sm"
            bg="white"
            color="black"
            border="1px solid black"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            isDisabled={currentPage === totalPages}
          >
            다음
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default MyPostsTable;
