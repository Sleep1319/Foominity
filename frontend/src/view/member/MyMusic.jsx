import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  Spinner,
  VStack,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import { useUser } from "@/redux/useUser.js";
import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";
import RecommendPanel from "../../components/chatbotComponents/RecommendPanel.jsx";
import GenreChart from "../../components/memberComponents/GenreChart.jsx";
import ReviewTrendChart from "../../components/memberComponents/ReviewTrendChart.jsx";
import RecommendedAlbums from "../../components/memberComponents/RecommendAlbums.jsx";

const MyMusic = () => {
  const { state } = useUser();
  const memberId = state.id;

  const [reviewCount, setReviewCount] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [genreStats, setGenreStats] = useState([]);
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [chatMode, setChatMode] = useState(null);
  const chatRef = useRef();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const countRes = await fetch("/api/member/review-count", {
          credentials: "include",
        });
        if (countRes.ok) setReviewCount(await countRes.json());

        const avgRes = await fetch("/api/member/average-rating", {
          credentials: "include",
        });
        if (avgRes.ok) setAverageRating(await avgRes.json());

        const reviewRes = await fetch("/api/member/participated-albums", {
          credentials: "include",
        });
        if (reviewRes.ok) setReviews(await reviewRes.json());

        const genreRes = await fetch(`/api/member/${memberId}/genre-stats`, {
          credentials: "include",
        });
        if (genreRes.ok) {
          const json = await genreRes.json();
          const stats = json.map(({ genre, count }) => ({ genre, count }));
          setGenreStats(stats);
          const top = stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0]);
          setFavoriteGenre(top.genre);
        }
      } catch (err) {
        console.error("통계 조회 중 에러:", err);
      }
    };
    fetchStats();
  }, [memberId]);

  return (
    <Box px={4} pt="100px" pb={16} maxW="1300px" mx="auto">
      {/* 프로필 헤더 */}
      <VStack spacing={2} textAlign="center" mb={10}>
        <Text fontSize="3xl" fontWeight="bold">
          {state.nickname} 님의 음악 프로필
        </Text>
      </VStack>

      <Tabs variant="unstyled" isFitted>
        {/* 상단 네비게이션 탭 */}
        <TabList mb={8} borderBottom="1px solid #ccc">
          <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>나의 활동</Tab>
          <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>AI 음악 비서</Tab>
        </TabList>

        <TabPanels>
          {/* ───── 나의 활동 탭 ───── */}
          <TabPanel p={0}>
            <SimpleGrid columns={[1, 2]} spacing={8} mb={14}>
              {/* 왼쪽 카드 */}
              <Box w="100%" p={6} minH="400px" borderRadius="lg" border="1px solid #e2e8f0" boxShadow="sm" bg="white">
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                      가장 선호하는 장르
                    </Text>
                    <Text fontSize="lg" fontWeight="bold">
                      {favoriteGenre || "-"}
                    </Text>
                  </Box>
                  <Flex w="100%" justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        작성한 리뷰
                      </Text>
                      <Text as="div" fontSize="lg" fontWeight="semibold">
                        {
                          reviewCount !== null ? `${reviewCount}개` : <Spinner size="sm" />
                          // "-"
                        }
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        평균 별점
                      </Text>
                      <Text as="div" fontSize="lg" fontWeight="semibold">
                        {averageRating !== null ? (
                          `${averageRating.toFixed(1)} ★`
                        ) : (
                          //  "-"
                          <Spinner size="sm" />
                        )}
                      </Text>
                    </Box>
                  </Flex>
                </VStack>
              </Box>

              {/* 오른쪽 차트 영역 */}
              <Box w="100%">
                <Tabs variant="unstyled" w="100%">
                  <TabList mb={2} border="none">
                    <Tab
                      color="gray.600"
                      fontWeight="medium"
                      _selected={{
                        color: "black",
                        fontWeight: "bold",
                        borderBottom: "1px solid black",
                      }}
                    >
                      좋아하는 장르 분포
                    </Tab>
                    <Tab
                      color="gray.600"
                      fontWeight="medium"
                      _selected={{
                        color: "black",
                        fontWeight: "bold",
                        borderBottom: "1px solid black",
                      }}
                    >
                      리뷰 작성 현황
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <GenreChart data={genreStats} />
                    </TabPanel>
                    <TabPanel p={0}>
                      {/* days prop 없이 사용 */}
                      <ReviewTrendChart reviews={reviews} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </SimpleGrid>
            {/* <RecommendedAlbums /> */}
            {/* <AppleMusicChart /> */}

            {/* 즐겨찾기/참여 앨범 */}
            <SimpleGrid columns={[1, 2]} spacing={8} mb={12}>
              <LikedAlbums />
              <ParticipatedAlbums />
            </SimpleGrid>
          </TabPanel>

          {/* ───── AI 음악 비서 탭 ───── */}
          <TabPanel p={0}>
            <Flex gap={6} w="100%">
              <Box flex="1" maxW="615px" h="600px">
                <GuidedChat ref={chatRef} onModeChange={setChatMode} />
              </Box>
              <Box flex="1" h="600px" overflowY={chatMode === "recommend" ? "auto" : "visible"}>
                {chatMode === "translate" && <TrackSearchWithLyrics />}
                {chatMode === "recommend" && (
                  <RecommendPanel onResult={(reply) => chatRef.current?.push({ sender: "BOT", content: reply })} />
                )}
                {chatMode === "diagnosis" && (
                  <Box p={4}>
                    <Text>진단할 노래 제목과 아티스트를 알려주세요.</Text>
                  </Box>
                )}
              </Box>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MyMusic;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Text,
//   Spinner,
//   VStack,
//   SimpleGrid,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
//   Flex,
// } from "@chakra-ui/react";
// import { useUser } from "../../context/UserContext.jsx";
// import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
// import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
// import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
// import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";
// import RecommendPanel from "../../components/chatbotComponents/RecommendPanel.jsx";
// import GenreChart from "../../components/memberComponents/GenreChart.jsx";
// import ReviewTrendChart from "../../components/memberComponents/ReviewTrendChart.jsx";
import AppleMusicChart from "./../../components/homeComponents/AppleMusicChart";

// const MyMusic = () => {
//   const { state } = useUser();
//   const memberId = state.memberId;

//   const [reviewCount, setReviewCount] = useState(null);
//   const [averageRating, setAverageRating] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [genreStats, setGenreStats] = useState([]);
//   const [favoriteGenre, setFavoriteGenre] = useState("");
//   const [chatMode, setChatMode] = useState(null);
//   const chatRef = useRef();

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const countRes = await fetch("/api/member/review-count", {
//           credentials: "include",
//         });
//         if (countRes.ok) setReviewCount(await countRes.json());

//         const avgRes = await fetch("/api/member/average-rating", {
//           credentials: "include",
//         });
//         if (avgRes.ok) setAverageRating(await avgRes.json());

//         const reviewRes = await fetch("/api/member/participated-albums", {
//           credentials: "include",
//         });
//         if (reviewRes.ok) setReviews(await reviewRes.json());

//         const genreRes = await fetch(`/api/member/${memberId}/genre-stats`, {
//           credentials: "include",
//         });
//         if (genreRes.ok) {
//           const json = await genreRes.json();
//           const stats = json.map(({ genre, count }) => ({ genre, count }));
//           setGenreStats(stats);
//           const top = stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0]);
//           setFavoriteGenre(top.genre);
//         }
//       } catch (err) {
//         console.error("통계 조회 중 에러:", err);
//       }
//     };
//     fetchStats();
//   }, [memberId]);

//   return (
//     <Box px={4} pt="100px" pb={16} maxW="1300px" mx="auto">
//       <VStack spacing={2} textAlign="center" mb={10}>
//         <Text fontSize="3xl" fontWeight="bold">
//           {state.nickname} 님의 음악 프로필
//         </Text>
//       </VStack>

//       <Tabs variant="unstyled" isFitted>
//         <TabList mb={8} borderBottom="1px solid #ccc">
//           <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>나의 활동</Tab>
//           <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>AI 음악 비서</Tab>
//         </TabList>
//         <TabPanels>
//           {/* 나의 활동 탭 */}
//           <TabPanel>
//             {/* 1단계: 텍스트 세로 배치 + 차트 탭으로 전환 */}
//             <SimpleGrid columns={[1, 2]} spacing={8} mb={14} maxH="400px" overflow="hidden">
//               {/* 좌측: 세로로 → 모던 카드 스타일로 수정 */}
//               <Box w="100%" maxH="350px" p={6} borderRadius="lg" border="1px solid #e2e8f0" boxShadow="sm" bg="white">
//                 <VStack align="start" spacing={4}>
//                   <Box>
//                     <Text fontSize="sm" color="gray.500" fontWeight="medium">
//                       가장 선호하는 장르
//                     </Text>
//                     <Text fontSize="lg" fontWeight="bold">
//                       {favoriteGenre || "-"}
//                     </Text>
//                   </Box>

//                   <Flex w="100%" justify="space-between">
//                     <Box>
//                       <Text fontSize="sm" color="gray.500" fontWeight="medium">
//                         작성한 리뷰
//                       </Text>
//                       <Text fontSize="lg" fontWeight="semibold">
//                         {reviewCount !== null ? `${reviewCount}개` : <Spinner size="sm" />}
//                       </Text>
//                     </Box>

//                     <Box textAlign="right">
//                       <Text fontSize="sm" color="gray.500" fontWeight="medium">
//                         평균 별점
//                       </Text>
//                       <Text fontSize="lg" fontWeight="semibold">
//                         {averageRating !== null ? `${averageRating.toFixed(1)} ★` : <Spinner size="sm" />}
//                       </Text>
//                     </Box>
//                   </Flex>
//                 </VStack>
//               </Box>
//               {/* 우측: 두 차트를 탭으로 */}
//               <Tabs
//                 // variant="enclosed"

//                 w="100%"
//                 variant="unstyled"
//               >
//                 <TabList border="none">
//                   <Tab
//                     color="gray.600"
//                     _selected={{ color: "black", fontWeight: "bold", borderBottom: "1px solid black" }}
//                     fontWeight="medium"
//                     _hover={{ color: "black", fontWeight: "bold" }}
//                     // border="1px solid black"
//                     // borderRadius="0px"
//                   >
//                     장르별 좋아요 분포
//                   </Tab>
//                   <Tab
//                     color="gray.600"
//                     _selected={{ color: "black", fontWeight: "bold", borderBottom: "1px solid black" }}
//                     fontWeight="medium"
//                     _hover={{ color: "black", fontWeight: "bold" }}
//                     // border="1px solid black"
//                     // borderRadius="0px"
//                   >
//                     최근 7일 리뷰 작성 현황
//                   </Tab>
//                 </TabList>
//                 <TabPanels>
//                   <TabPanel p={0}>
//                     <GenreChart data={genreStats} />
//                   </TabPanel>
//                   <TabPanel p={0}>
//                     <ReviewTrendChart reviews={reviews} />
//                   </TabPanel>
//                 </TabPanels>
//               </Tabs>
//             </SimpleGrid>

//             {/* 2단계: 즐겨찾기/참여 앨범 */}
//             <SimpleGrid columns={[1, 2]} spacing={8} mb={12}>
//               <LikedAlbums />
//               <ParticipatedAlbums />
//             </SimpleGrid>
//           </TabPanel>

//           {/* 챗봇 탭 */}
//           <TabPanel>
//             <Flex gap={6} w="100%">
//               <Box flex="1" maxW="615px" h="600px">
//                 <GuidedChat ref={chatRef} onModeChange={setChatMode} />
//               </Box>
//               <Box flex="1" h="600px" overflowY={chatMode === "recommend" ? "auto" : "visible"}>
//                 {chatMode === "translate" && <TrackSearchWithLyrics />}
//                 {chatMode === "recommend" && (
//                   <RecommendPanel onResult={(reply) => chatRef.current?.push({ sender: "BOT", content: reply })} />
//                 )}
//                 {chatMode === "diagnosis" && (
//                   <Box p={4}>
//                     <Text>진단할 노래 제목과 아티스트를 알려주세요.</Text>
//                   </Box>
//                 )}
//               </Box>
//             </Flex>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Box>
//   );
// };

// export default MyMusic;
