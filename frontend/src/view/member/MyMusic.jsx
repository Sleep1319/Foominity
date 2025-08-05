// import React, { useState, useEffect } from "react";
// import { Box, Text, Grid, Flex, Spinner, Button, useColorModeValue } from "@chakra-ui/react";
// import { useUser } from "../../context/UserContext.jsx";
// import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
// import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
// import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
// import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";
// import GenreChart from "../../components/memberComponents/GenreChart.jsx";

// const MyMusic = () => {
//   const { state } = useUser();
//   const memberId = state.memberId;

//   const [reviewCount, setReviewCount] = useState(null);
//   const [averageRating, setAverageRating] = useState(null);
//   const [chatMode, setChatMode] = useState(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [countRes, avgRes] = await Promise.all([
//           fetch("/api/member/review-count", { credentials: "include" }),
//           fetch("/api/member/average-rating", { credentials: "include" }),
//         ]);
//         if (countRes.ok) setReviewCount(await countRes.json());
//         if (avgRes.ok) setAverageRating(await avgRes.json());
//       } catch (err) {
//         console.error("통계 조회 중 에러:", err);
//       }
//     })();
//   }, []);

//   const cardBg = useColorModeValue("white", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");

//   return (
//     // 전체 폭을 100%로 변경했습니다.
//     <Box px={{ base: 4, md: 8 }} py={10} w="100%">
//       {/* 페이지 제목 */}
//       <Text textAlign="center" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={8}>
//         {state.nickname} 님의 음악 공간
//       </Text>

//       {/* 상단: 통계 + 차트 */}
//       <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={10}>
//         <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="md" p={6} textAlign="center">
//           {reviewCount !== null && averageRating !== null ? (
//             <>
//               <Text fontSize="lg">
//                 리뷰 수:{" "}
//                 <Text as="span" fontWeight="bold">
//                   {reviewCount}개
//                 </Text>
//               </Text>
//               <Text fontSize="lg" mt={2}>
//                 평균 평점:{" "}
//                 <Text as="span" fontWeight="bold">
//                   {averageRating.toFixed(1)}
//                 </Text>
//               </Text>
//             </>
//           ) : (
//             <Spinner size="lg" />
//           )}
//         </Box>

//         <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="md" p={6}>
//           <GenreChart memberId={memberId} />
//         </Box>
//       </Grid>

//       {/* 하단: 앨범 섹션(두 카드 가로 배치) + 챗봇 */}
//       <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
//         {/* 앨범 섹션 */}
//         <Flex w="100%" gap={6}>
//           {/* 참여한 앨범 */}
//           <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="md" p={4} flex="1">
//             <Flex justify="space-between" align="center" mb={4}>
//               <Text fontSize="lg" fontWeight="medium">
//                 내가 평가한 앨범
//               </Text>
//               <Button size="sm" variant="outline">
//                 전체보기
//               </Button>
//             </Flex>
//             <ParticipatedAlbums />
//           </Box>

//           {/* 좋아하는 앨범 */}
//           <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="md" p={4} flex="1">
//             <Flex justify="space-between" align="center" mb={4}>
//               <Text fontSize="lg" fontWeight="medium">
//                 내가 좋아하는 앨범
//               </Text>
//               <Button size="sm" variant="outline">
//                 전체보기
//               </Button>
//             </Flex>
//             <LikedAlbums />
//           </Box>
//         </Flex>

//         {/* 챗봇 섹션 */}
//         <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="md" p={4}>
//           <Text fontSize="lg" fontWeight="medium" mb={4}>
//             챗봇 지원
//           </Text>
//           <GuidedChat onModeChange={setChatMode} />
//           {chatMode === "translate" && (
//             <Box mt={4}>
//               <TrackSearchWithLyrics />
//             </Box>
//           )}
//         </Box>
//       </Grid>
//     </Box>
//   );
// };

// export default MyMusic;

import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Spinner, Grid, VStack, HStack } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext.jsx";
import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";
import GenreChart from "../../components/memberComponents/GenreChart.jsx";
import ReviewTrendChart from "../../components/memberComponents/ReviewTrendChart.jsx";

const MyMusic = () => {
  const { state } = useUser();
  const memberId = state.memberId;
  const [reviewCount, setReviewCount] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [chatMode, setChatMode] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const countRes = await fetch("/api/member/review-count", {
          credentials: "include",
        });
        if (countRes.ok) {
          const count = await countRes.json();
          setReviewCount(count);
        }

        const avgRes = await fetch("/api/member/average-rating", {
          credentials: "include",
        });
        if (avgRes.ok) {
          const avg = await avgRes.json();
          setAverageRating(avg);
        }

        const reviewRes = await fetch("/api/member/participated-albums", {
          credentials: "include",
        });
        if (reviewRes.ok) {
          const list = await reviewRes.json();
          setReviews(list);
        }
      } catch (err) {
        console.error("통계 조회 중 에러:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box px={4} pt="100px" pb={10}>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        pb={2}
        mb={6}
      >
        {state.nickname} 님의 음악
      </Text>

      {/* 상단 통계 */}
      <Flex justify="center" align="center" mb={8} direction="column">
        <VStack>
          <Text>상단에 활동내역 만들 예정임</Text>
          {reviewCount !== null ? <Text>리뷰 수: {reviewCount}개</Text> : <Spinner size="sm" />}
          {averageRating !== null ? <Text>평균 평점: {averageRating.toFixed(1)}</Text> : <Spinner size="sm" />}
        </VStack>

        <HStack w="1500px" h="300px">
          <Box mt={6} w={{ base: "100%", md: "50%" }} maxW="600px" mx="auto">
            <GenreChart memberId={memberId} />
          </Box>
          {reviews.length > 0 && (
            <Box mt={8} w="100%" maxW="700px">
              <ReviewTrendChart reviews={reviews} />
            </Box>
          )}
        </HStack>
      </Flex>

      {/* 참여한 앨범 & 좋아요 앨범 옆에 챗봇 */}
      <Flex mb={12} align="flex-start" gap={8}>
        <Grid templateColumns={["1fr", "1fr 1fr"]} gap={4} flex="2">
          <ParticipatedAlbums />
          <LikedAlbums />
        </Grid>

        <Box flex="1" minW="300px">
          <GuidedChat onModeChange={setChatMode} />
          {chatMode === "translate" && (
            <Box mt={4}>
              <TrackSearchWithLyrics />
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default MyMusic;

//=========================================================================================================

// import React, { useState, useEffect } from "react";
// import { Text, Box, Flex, Spinner, VStack } from "@chakra-ui/react";
// import { useUser } from "../../context/UserContext.jsx";
// import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
// import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
// import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
// import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";

// const MyMusic = () => {
//   const { state } = useUser();

//   // 리뷰 수와 평균 평점 상태
//   const [reviewCount, setReviewCount] = useState(null);
//   const [averageRating, setAverageRating] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // 리뷰 수 조회
//         const countRes = await fetch("/api/member/review-count", {
//           credentials: "include",
//         });
//         if (countRes.ok) {
//           const count = await countRes.json();
//           setReviewCount(count);
//         }

//         // 평균 평점 조회
//         const avgRes = await fetch("/api/member/average-rating", {
//           credentials: "include",
//         });
//         if (avgRes.ok) {
//           const avg = await avgRes.json();
//           setAverageRating(avg);
//         }
//       } catch (err) {
//         console.error("통계 조회 중 에러:", err);
//       }
//     };

//     fetchStats();
//   }, []);

//   // 채팅 모드 상태
//   const [chatMode, setChatMode] = useState(null);

//   return (
//     <>
//       {/* 제목 */}
//       <Text
//         lineHeight="2.5"
//         textAlign="center"
//         fontSize="3xl"
//         fontWeight="medium"
//         borderBottom="2px solid gray"
//         pb={2}
//         // mt={4}
//         mt="100px"
//         ml={5}
//         h="85px"
//       >
//         {state.nickname} 님의 음악
//       </Text>
//       <VStack>
//         <Text mb="-25px" mt={5}>
//           일단 정보만 띄워둔거임
//         </Text>
//         {/* 상단 통계 표시 영역 */}
//         <Box px={5} mt={4}>
//           <Flex justify="center" align="center">
//             {reviewCount !== null ? <Text mr={6}>리뷰 수: {reviewCount}개</Text> : <Spinner mr={6} size="sm" />}
//             {averageRating !== null ? <Text>평균 평점: {averageRating.toFixed(1)}</Text> : <Spinner size="sm" />}
//           </Flex>
//         </Box>
//       </VStack>

//       {/* 참여한 앨범 & 좋아요 앨범 */}
//       <ParticipatedAlbums />
//       <LikedAlbums />

//       {/* Guided Chat 영역 */}
//       <Box maxW="450px" mx="auto" px={4} mt={8} mb={20}>
//         <GuidedChat onModeChange={setChatMode} />
//       </Box>

//       {/* translate 모드일 때만 화면에 표시 */}
//       {chatMode === "translate" && <TrackSearchWithLyrics />}
//     </>
//   );
// };

// export default MyMusic;
