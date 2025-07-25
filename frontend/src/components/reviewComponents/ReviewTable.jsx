import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Image, Text, SimpleGrid, Spinner, Center, AspectRatio, VStack, Button, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import TopRankedAlbums from "./TopRankedAlbums";

const ReviewGrid = () => {
  const { state, isLoading } = useUser();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("/api/reviews?page=0")
      .then((res) => setReviews(res.data.content))
      .catch((err) => console.error("리뷰 조회 실패:", err));
  }, []);

  const filtered = reviews.filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" />
        <Text ml={4}>로딩 중...</Text>
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      {state?.roleName === "ADMIN" && (
        <Box textAlign="right" mb={4}>
          <Button colorScheme="blue" onClick={() => navigate("/review/create")}>
            리뷰 작성
          </Button>
        </Box>
      )}
      {/* 검색창 */}
      <Input
        placeholder="앨범 제목으로 검색"
        mb={6}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TopRankedAlbums />
      {filtered.length === 0 ? (
        <Text>{searchTerm ? "검색된 결과가 없습니다." : "아직 평가한 앨범이 없습니다."}</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
          {filtered.map((r) => (
            <Box
              key={r.id}
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
              cursor="pointer"
              onClick={() => navigate(`/review/${r.id}`)}
            >
              {/* 정사각 비율로 앨범 커버 */}
              <AspectRatio ratio={1} w="100%">
                <Image
                  src={r.imagePath ? `http://localhost:8084/${r.imagePath}` : ""}
                  alt={r.title}
                  objectFit="cover"
                />
              </AspectRatio>

              <VStack align="start" spacing={1} p={3}>
                <Text fontSize="md" fontWeight="semibold" noOfLines={2}>
                  {r.title}
                </Text>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {r.artists?.map((a) => a.name).join(", ") || "정보 없음"}
                </Text>
                {/* <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {r.categories?.map((c) => c.categoryName).join(", ") || "정보 없음"}
                </Text> */}
                <Text fontSize="sm">
                  평균별점: {typeof r.averageStarPoint === "number" ? r.averageStarPoint.toFixed(1) : "0.0"}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ReviewGrid;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Image,
//   Text,
//   Button,
//   Spinner,
//   Center,
//   Input,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   TableContainer,
// } from "@chakra-ui/react";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { useUser } from "../../context/UserContext";
// import TopRankedAlbums from "../homeComponents/TopRankedAlbums";

// const ReviewTable = () => {
//   const { state, isLoading } = useUser();
//   const [reviews, setReviews] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("/api/reviews?page=0")
//       .then((res) => setReviews(res.data.content))
//       .catch((err) => console.error("리뷰 조회 실패:", err));
//   }, []);

//   const filtered = reviews.filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

//   if (isLoading) {
//     return (
//       <Center h="300px">
//         <Spinner size="xl" />
//         <Text ml={4}>로딩 중...</Text>
//       </Center>
//     );
//   }

//   return (
//     <>
//       <TopRankedAlbums />
//       <Box maxW="1500px" mx="auto" px={4} py={8}>
//         {state?.roleName === "ADMIN" && (
//           <Box textAlign="right" mb={4}>
//             <Button
//               bg="black"
//               color="white"
//               _hover={{
//                 bg: "black",
//                 color: "white",
//               }}
//               onClick={() => navigate("/review/create")}
//             >
//               리뷰 작성
//             </Button>
//           </Box>
//         )}

//         {/* 검색창 */}
//         <Input
//           placeholder="앨범 제목으로 검색"
//           mb={6}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <TableContainer>
//           <Table variant="simple" size="md">
//             <Thead>
//               <Tr>
//                 <Th textAlign="center">번호</Th>
//                 <Th textAlign="center">앨범</Th>
//                 <Th textAlign="center">아티스트</Th>
//                 <Th textAlign="center">장르</Th>
//                 <Th textAlign="center">평점</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {filtered.length === 0 ? (
//                 <Tr>
//                   <Td colSpan={5} textAlign="center">
//                     {searchTerm ? "검색된 결과가 없습니다." : "아직 게시된 리뷰가 없습니다."}
//                   </Td>
//                 </Tr>
//               ) : (
//                 filtered.map((review, index) => (
//                   <Tr key={review.id}>
//                     <Td textAlign="center">{index + 1}</Td>
//                     <Td textAlign="center">
//                       <RouterLink to={`/review/${review.id}`}>
//                         <Box display="flex" alignItems="center" gap={3} justifyContent="center">
//                           <Image
//                             src={review.imagePath ? `http://localhost:8084/${review.imagePath}` : ""}
//                             alt={review.title}
//                             boxSize="50px"
//                             objectFit="cover"
//                             borderRadius="md"
//                           />
//                           <Text>{review.title}</Text>
//                         </Box>
//                       </RouterLink>
//                     </Td>
//                     <Td textAlign="center">{review.artists?.map((artist) => artist.name).join(", ") || "정보 없음"}</Td>
//                     <Td textAlign="center">
//                       {review.categories?.map((category) => category.categoryName).join(", ") || "정보 없음"}
//                     </Td>
//                     <Td textAlign="center">
//                       {typeof review.averageStarPoint === "number" ? review.averageStarPoint.toFixed(1) : "0.0"}
//                     </Td>
//                   </Tr>
//                 ))
//               )}
//             </Tbody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </>
//   );
// };

// export default ReviewTable;
