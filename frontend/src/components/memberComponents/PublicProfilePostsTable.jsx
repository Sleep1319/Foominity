import { Table, Thead, Tbody, Tr, Th, Td, Spinner, Box, Text, Button, Flex } from "@chakra-ui/react";
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

  if (loading) return <Spinner />;
  if (posts.length === 0) return <Box>작성한 게시물이 없습니다.</Box>;

  // 총 페이지 수
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 현재 페이지에 보여줄 게시물
  const startIdx = (currentPage - 1) * postsPerPage;
  const paginatedPosts = posts.slice(startIdx, startIdx + postsPerPage);

  return (
    <>
      <Box maxW="650px" mx="auto" px={4} py={8}>
        <Text fontSize="2xl" fontWeight="bold" mb={10}>
          작성한 글
        </Text>
        <Table variant="simple" w="100%">
          <Thead>
            <Tr>
              <Th w="80px">번호</Th>
              <Th>제목</Th>
              <Th w="128px">작성일</Th>
              <Th w="85px" isNumeric>
                조회수
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedPosts.map((p, i) => (
              <Tr key={p.id}>
                <Td w="60px">{startIdx + i + 1}</Td>
                <Td maxW="180px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  <RouterLink to={`/board/${p.id}`}>
                    <Text _hover={{ textDecoration: "underline" }}>{p.title}</Text>
                  </RouterLink>
                </Td>
                <Td w="120px">{new Date(p.createdDate).toLocaleDateString()}</Td>
                <Td w="70px" isNumeric>
                  {p.views}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* 페이징 컨트롤 */}
        <Flex justify="center" align="center" mt={4} gap={2}>
          <Button
            bg="black"
            color="white"
            size="sm"
            maxH="30px"
            _hover={{
              bg: "gray.600",
              color: "white",
            }}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            isDisabled={currentPage === 1}
          >
            이전
          </Button>
          <Text>
            {currentPage} / {totalPages}
          </Text>
          <Button
            size="sm"
            bg="black"
            color="white"
            maxH="30px"
            _hover={{
              bg: "gray.600",
              color: "white",
            }}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            isDisabled={currentPage === totalPages}
          >
            다음
          </Button>
        </Flex>
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
//   if (posts.length === 0) return <Box>작성한 게시물이 없습니다.</Box>;

//   // 총 페이지 수
//   const totalPages = Math.ceil(posts.length / postsPerPage);

//   // 현재 페이지에 보여줄 게시물
//   const startIdx = (currentPage - 1) * postsPerPage;
//   const paginatedPosts = posts.slice(startIdx, startIdx + postsPerPage);

//   return (
//     <>
//       <Text fontSize="2xl" fontWeight="bold">
//         작성한 글
//       </Text>
//       <Table variant="simple">
//         <Thead>
//           <Tr>
//             <Th>번호</Th>
//             <Th>제목</Th>
//             <Th>작성일</Th>
//             <Th>조회수</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {paginatedPosts.map((p, i) => (
//             <Tr key={p.id}>
//               <Td>{startIdx + i + 1}</Td>
//               <Td>
//                 <RouterLink to={`/board/${p.id}`}>
//                   <Text _hover={{ textDecoration: "underline" }}>{p.title}</Text>
//                 </RouterLink>
//               </Td>
//               <Td>{new Date(p.createdDate).toLocaleDateString()}</Td>
//               <Td>{p.views}</Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>

//       {/* 페이징 컨트롤 */}
//       <Flex justify="center" align="center" mt={4} gap={2}>
//         <Button
//           bg="black"
//           color="white"
//           size="sm"
//           _hover={{
//             bg: "gray.600",
//             color: "white",
//           }}
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           isDisabled={currentPage === 1}
//         >
//           이전
//         </Button>
//         <Text>
//           {currentPage} / {totalPages}
//         </Text>
//         <Button
//           size="sm"
//           bg="black"
//           color="white"
//           _hover={{
//             bg: "gray.600",
//             color: "white",
//           }}
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           isDisabled={currentPage === totalPages}
//         >
//           다음
//         </Button>
//       </Flex>
//     </>
//   );
// };

// export default PublicProfilePostsTable;
