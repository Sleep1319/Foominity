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
import { useUser } from "../../context/UserContext.jsx";
import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";
import RecommendPanel from "../../components/chatbotComponents/RecommendPanel.jsx";
import GenreChart from "../../components/memberComponents/GenreChart.jsx";
import ReviewTrendChart from "../../components/memberComponents/ReviewTrendChart.jsx";

const MyMusic = () => {
  const { state } = useUser();
  const memberId = state.memberId;

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
      <VStack spacing={2} textAlign="center" mb={10}>
        <Text fontSize="3xl" fontWeight="bold">
          {state.nickname} 님의 음악 프로필
        </Text>
      </VStack>

      <Tabs variant="unstyled" isFitted>
        <TabList mb={8} borderBottom="1px solid #ccc">
          <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>나의 활동</Tab>
          <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>AI 음악 비서</Tab>
        </TabList>

        <TabPanels>
          {/* 나의 활동 탭 */}
          <TabPanel>
            {/* 1단계: 텍스트 세로 배치 + 차트 탭으로 전환 */}
            <SimpleGrid columns={[1, 2]} spacing={8} mb={14}>
              {/* 우측: 두 차트를 탭으로 */}
              <Tabs variant="enclosed" w="100%">
                <TabList border="none">
                  <Tab
                    color="gray.600"
                    _selected={{ color: "black", fontWeight: "bold", borderBottom: "1px solid black" }}
                    fontWeight="medium"
                    _hover={{ color: "black", fontWeight: "bold" }}
                    // border="1px solid black"
                    // borderRadius="0px"
                  >
                    장르별 좋아요 분포
                  </Tab>
                  <Tab
                    color="gray.600"
                    _selected={{ color: "black", fontWeight: "bold", borderBottom: "1px solid black" }}
                    fontWeight="medium"
                    _hover={{ color: "black", fontWeight: "bold" }}
                    // border="1px solid black"
                    // borderRadius="0px"
                  >
                    최근 7일 리뷰 작성 현황
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0}>
                    <GenreChart data={genreStats} />
                  </TabPanel>
                  <TabPanel p={0}>
                    <ReviewTrendChart reviews={reviews} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              {/* 좌측: 세로로 */}
              <VStack align="start" spacing={4}>
                {favoriteGenre !== null ? (
                  <Text fontSize="md" color="gray.700">
                    가장 선호하는 장르: {favoriteGenre}
                  </Text>
                ) : (
                  <Spinner size="sm" />
                )}
                {reviewCount !== null ? (
                  <Text fontSize="md" color="gray.700">
                    작성한 리뷰: {reviewCount}개
                  </Text>
                ) : (
                  <Spinner size="sm" />
                )}
                {averageRating !== null ? (
                  <Text fontSize="md" color="gray.700">
                    평균 별점: {averageRating.toFixed(1)}
                  </Text>
                ) : (
                  <Spinner size="sm" />
                )}
              </VStack>
            </SimpleGrid>

            {/* 2단계: 즐겨찾기/참여 앨범 */}
            <SimpleGrid columns={[1, 2]} spacing={8} mb={12}>
              <LikedAlbums />
              <ParticipatedAlbums />
            </SimpleGrid>
          </TabPanel>

          {/* 챗봇 탭 */}
          <TabPanel>
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

//============================================================

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Text,
//   Spinner,
//   VStack,
//   HStack,
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
//             <HStack spacing={6} mt={2}>
//               {favoriteGenre ? (
//                 <Text fontSize="md" color="gray.700">
//                   제일 좋아하는 장르: {favoriteGenre}
//                 </Text>
//               ) : (
//                 <Spinner size="sm" />
//               )}
//               {reviewCount !== null ? (
//                 <Text fontSize="md" color="gray.700">
//                   작성한 리뷰: {reviewCount}개
//                 </Text>
//               ) : (
//                 <Spinner size="sm" />
//               )}
//               {averageRating !== null ? (
//                 <Text fontSize="md" color="gray.700">
//                   평균 별점: {averageRating.toFixed(1)}
//                 </Text>
//               ) : (
//                 <Spinner size="sm" />
//               )}
//             </HStack>

//             <SimpleGrid columns={[1, 2]} spacing={8} mb={14}>
//               <GenreChart data={genreStats} />
//               <ReviewTrendChart reviews={reviews} />
//             </SimpleGrid>

//             <SimpleGrid columns={[1, 2]} spacing={8} mb={12}>
//               <LikedAlbums />
//               <ParticipatedAlbums />
//             </SimpleGrid>
//           </TabPanel>

//           {/* 챗봇 탭 */}
//           <TabPanel>
//             <Flex gap={6} w="100%">
//               {/* 왼쪽: GuidedChat */}
//               <Box flex="1" maxW="615px" h="600px">
//                 <GuidedChat ref={chatRef} onModeChange={setChatMode} />
//               </Box>

//               {/* 오른쪽: mode별 패널 */}
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
