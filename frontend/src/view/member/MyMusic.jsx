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
// 유사곡용 iTunes 검색 패널 임포트
import TrackSearchForSimilar from "../../components/chatbotComponents/TrackSearchForSimilar.jsx";

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
          const top =
            stats && stats.length
              ? stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0])
              : { genre: "" };
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
      {/* <RecommendedAlbums /> */}

      <Tabs variant="unstyled" isFitted>
        {/* 상단 네비게이션 탭 */}
        <TabList mb={8} borderBottom="1px solid #ccc">
          <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>
            나의 활동
          </Tab>
          <Tab _selected={{ borderBottom: "2px solid black", fontWeight: "bold" }}>
            AI 음악 비서
          </Tab>
        </TabList>

        <TabPanels>
          {/* ───── 나의 활동 탭 ───── */}
          <TabPanel p={0}>
            <SimpleGrid columns={[1, 2]} spacing={8} mb={14}>
              {/* 왼쪽 카드 */}
              <Box
                w="100%"
                p={6}
                minH="400px"
                borderRadius="lg"
                border="1px solid #e2e8f0"
                boxShadow="sm"
                bg="white"
              >
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
                        {reviewCount !== null ? (
                          `${reviewCount}개`
                        ) : (
                          <Spinner size="sm" />
                        )}
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

            {/* 즐겨찾기/참여 앨범 */}
            <SimpleGrid columns={[1, 2]} spacing={8} mb={12}>
              <LikedAlbums />
              <ParticipatedAlbums />
            </SimpleGrid>
          </TabPanel>

          {/* ───── AI 음악 비서 탭 ───── */}
          <TabPanel p={0}>
            <Flex gap={6} w="100%" mb="55px">
              <Box flex="1" maxW="615px" h="600px" mt="10px">
                <GuidedChat ref={chatRef} onModeChange={setChatMode} />
              </Box>

              <Box
                flex="1"
                h="600px"
                overflowY={chatMode === "recommend" ? "auto" : "visible"}
              >
                {chatMode === "translate" && <TrackSearchWithLyrics />}

                {chatMode === "recommend" && (
                  <RecommendPanel
                    onResult={(reply) =>
                      chatRef.current?.push({ sender: "BOT", content: reply })
                    }
                  />
                )}

                {/* 유사곡 모드: 오른쪽에 iTunes 검색 패널 표시 */}
                {chatMode === "similar" && (
                  <TrackSearchForSimilar 
                    onPick={(seedText,meta) => {
                      // 곡을 클릭하면 좌측 GuidedChat으로 자동 전송
                      chatRef.current?.sendSimilar(seedText,meta);
                    }}
                  />
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

