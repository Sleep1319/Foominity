import { Table, Thead, Tbody, Tr, Th, Td, Spinner, Box, Text, Button, Flex, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";

const PublicProfilePostsTable = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/board/member/${id}`, { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error("내 게시물 조회 실패", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
        {/* <Text fontSize="2xl" fontWeight="bold" mb={6}>
          작성한 글
        </Text> */}

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
            {paginatedPosts.map((p, i) => (
              <Tr key={p.id} height="40px">
                <Td>{startIdx + i + 1}</Td>
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

        {/* 페이지네이션 - 디자인 통일 */}
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

export default PublicProfilePostsTable;

// import { Table, Thead, Tbody, Tr, Th, Td, Spinner, Box, Text, Button, Flex } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
// import { Link as RouterLink, useParams } from "react-router-dom";
// import axios from "axios";

// const PublicProfilePostsTable = () => {
//   const { id } = useParams();
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 페이지네이션 상태
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 5;

//   useEffect(() => {
//     if (!id) return;
//     axios
//       .get(`/api/board/member/${id}`, { withCredentials: true })
//       .then((res) => setPosts(res.data))
//       .catch((err) => {
//         console.error("내 게시물 조회 실패", err);
//         setPosts([]);
//       })
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <Spinner />;
//   if (posts.length === 0) return <Box ml="207px">작성한 게시물이 없습니다.</Box>;

//   // 총 페이지 수
//   const totalPages = Math.ceil(posts.length / postsPerPage);

//   // 현재 페이지에 보여줄 게시물
//   const startIdx = (currentPage - 1) * postsPerPage;
//   const paginatedPosts = posts.slice(startIdx, startIdx + postsPerPage);

//   return (
//     <>
//       <Box maxW="650px" mx="auto" px={4} py={8}>
//         <Text fontSize="2xl" fontWeight="bold" mb={10}>
//           작성한 글
//         </Text>
//         <Table variant="simple" w="100%">
//           <Thead>
//             <Tr>
//               <Th w="80px">번호</Th>
//               <Th>제목</Th>
//               <Th w="128px">작성일</Th>
//               <Th w="85px" isNumeric>
//                 조회수
//               </Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {paginatedPosts.map((p, i) => (
//               <Tr key={p.id}>
//                 <Td w="60px">{startIdx + i + 1}</Td>
//                 <Td maxW="180px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
//                   <RouterLink to={`/board/${p.id}`}>
//                     <Text _hover={{ textDecoration: "underline" }}>{p.title}</Text>
//                   </RouterLink>
//                 </Td>
//                 <Td w="120px">{new Date(p.createdDate).toLocaleDateString()}</Td>
//                 <Td w="70px" isNumeric>
//                   {p.views}
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>

//         {/* 페이징 컨트롤 */}
//         <Flex justify="center" align="center" mt={4} gap={2}>
//           <Button
//             bg="black"
//             color="white"
//             size="sm"
//             maxH="30px"
//             _hover={{
//               bg: "gray.600",
//               color: "white",
//             }}
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             isDisabled={currentPage === 1}
//           >
//             이전
//           </Button>
//           <Text>
//             {currentPage} / {totalPages}
//           </Text>
//           <Button
//             size="sm"
//             bg="black"
//             color="white"
//             maxH="30px"
//             _hover={{
//               bg: "gray.600",
//               color: "white",
//             }}
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             isDisabled={currentPage === totalPages}
//           >
//             다음
//           </Button>
//         </Flex>
//       </Box>
//     </>
//   );
// };

// export default PublicProfilePostsTable;
