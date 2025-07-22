import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Image, Text, SimpleGrid, Spinner, Center, VStack, AspectRatio, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ParticipatedAlbumsGrid = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/me/participated-albums", { withCredentials: true })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("내가 평가한 앨범 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="lg" />
        <Text ml={3}>불러오는 중...</Text>
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        내가 평가한 앨범
      </Text>

      {/* 검색창 */}
      <Input
        placeholder="앨범 제목으로 검색"
        mb={6}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.length === 0 ? (
        <Text>{searchTerm ? "검색된 결과가 없습니다." : "아직 평가한 앨범이 없습니다."}</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
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
              {/* 정사각형 비율 */}
              <AspectRatio ratio={1} w="100%">
                <Image
                  src={r.imagePath ? `http://localhost:8084/${r.imagePath}` : ""}
                  alt={r.title}
                  objectFit="cover"
                />
              </AspectRatio>

              <VStack align="start" spacing={2} p={4}>
                <Text fontSize="lg" fontWeight="semibold" noOfLines={2}>
                  {r.title}
                </Text>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {r.artists?.map((a) => a.name).join(", ")}
                </Text>
                <Text fontSize="sm">평균별점: {r.averageStarPoint.toFixed(1)}</Text>
                {/* 내 평점도 함께 보여주려면 DTO, 백엔드에서 userStarPoint를 내려주도록 수정 후:
                <Text fontSize="sm" color="purple.600">
                  내 평점: {r.userStarPoint?.toFixed(1) ?? "0.0"}
                </Text>
                */}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ParticipatedAlbumsGrid;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Box, Image, Text, SimpleGrid, Spinner, Center, VStack, AspectRatio } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";

// const ParticipatedAlbumsGrid = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("/api/reviews/me/participated-reviews", { withCredentials: true })
//       .then((res) => setReviews(res.data))
//       .catch((err) => console.error("내가 평가한 앨범 불러오기 실패:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <Center h="200px">
//         <Spinner size="lg" />
//         <Text ml={3}>불러오는 중...</Text>
//       </Center>
//     );
//   }

//   return (
//     <>
//       <Text
//         lineHeight="2.5"
//         textAlign="center"
//         fontSize="3xl"
//         fontWeight="medium"
//         borderBottom="2px solid gray"
//         pb={2}
//         mt={4}
//         ml={5}
//         height="85px"
//       ></Text>
//       <Box maxW="1200px" mx="auto" px={4} py={8}>
//         <Text fontSize="2xl" fontWeight="bold" mb={6}>
//           내가 평가한 앨범
//         </Text>

//         {reviews.length === 0 ? (
//           <Text>아직 평가한 앨범이 없습니다.</Text>
//         ) : (
//           <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
//             {reviews.map((r) => (
//               <Box
//                 key={r.id}
//                 borderWidth="1px"
//                 borderRadius="md"
//                 overflow="hidden"
//                 boxShadow="sm"
//                 _hover={{ boxShadow: "md" }}
//                 cursor="pointer"
//                 onClick={() => navigate(`/review/${r.id}`)}
//               >
//                 {/* 1:1 비율 AspectRatio */}
//                 <AspectRatio ratio={1} w="100%">
//                   <Image
//                     src={r.imagePath ? `http://localhost:8084/${r.imagePath}` : ""}
//                     alt={r.title}
//                     objectFit="cover"
//                   />
//                 </AspectRatio>

//                 <VStack align="start" spacing={2} p={4}>
//                   <Text fontSize="lg" fontWeight="semibold" noOfLines={2}>
//                     {r.title}
//                   </Text>
//                   <Text fontSize="sm" color="gray.600" noOfLines={1}>
//                     {r.artists?.map((a) => a.name).join(", ")}
//                   </Text>
//                   <Text fontSize="sm">평균별점: {r.averageStarPoint.toFixed(1)}</Text>
//                   {/* 내 평점 추가 시:
//                 <Text fontSize="sm" color="purple.600">
//                   내 평점: {r.userStarPoint?.toFixed(1) ?? "0.0"}
//                 </Text>
//                 */}
//                 </VStack>
//               </Box>
//             ))}
//           </SimpleGrid>
//         )}
//       </Box>
//     </>
//   );
// };

// export default ParticipatedAlbumsGrid;
