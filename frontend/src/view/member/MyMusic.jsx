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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/redux/useUser.js";
import LikedAlbums from "../../components/memberComponents/LikedAlbums.jsx";
import ParticipatedAlbums from "../../components/memberComponents/ParticipatedAlbums.jsx";
import TrackSearchWithLyrics from "../../components/chatbotComponents/TrackSearchWithLyrics.jsx";
import GuidedChat from "../../components/chatbotComponents/GuidedChat.jsx";
import RecommendPanel from "../../components/chatbotComponents/RecommendPanel.jsx";
import GenreChart from "../../components/memberComponents/GenreChart.jsx";
import ReviewTrendChart from "../../components/memberComponents/ReviewTrendChart.jsx";
// 유사곡용 iTunes 검색 패널 임포트
import TrackSearchForSimilar from "../../components/chatbotComponents/TrackSearchForSimilar.jsx";
import RecommendedAlbums from "./../../components/memberComponents/RecommendAlbums";

const PREVIEW_COUNT = 4;

const MyMusic = () => {
  const { state } = useUser();
  const memberId = state.id;
  const navigate = useNavigate();

  const [reviewCount, setReviewCount] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]); // 내가 평가한 앨범 (차트 + 모달에서 사용)
  const [likedAll, setLikedAll] = useState([]); // 좋아요 앨범 (모달에서 사용)

  const [genreStats, setGenreStats] = useState([]);
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [chatMode, setChatMode] = useState(null);
  const chatRef = useRef();

  // 모달 오픈 제어
  const likedDisc = useDisclosure();
  const partDisc = useDisclosure();

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

        // 내가 평가한 앨범 (차트 & 모달 공용)
        const reviewRes = await fetch("/api/member/participated-albums", {
          credentials: "include",
        });
        if (reviewRes.ok) setReviews(await reviewRes.json());

        // 좋아요 앨범 (모달용) – LikedAlbums와 동일한 매핑
        const likedRes = await fetch("/api/member/liked-albums", {
          credentials: "include",
        });
        if (likedRes.ok) {
          const raw = await likedRes.json();
          const mapped = raw.map((album) => {
            const artistsArr = (album.artists ?? []).map((a) => ({
              id: a.id ?? a.artistId ?? a.artist_id ?? null,
              name: a.name ?? a.artistName ?? "",
            }));
            return {
              id: album.id,
              imagePath: album.imagePath || album.coverImage || "",
              title: album.title,
              artists: artistsArr,
            };
          });
          setLikedAll(mapped);
        }

        const genreRes = await fetch(`/api/member/${memberId}/genre-stats`, {
          credentials: "include",
        });
        if (genreRes.ok) {
          const json = await genreRes.json();
          const stats = json.map(({ genre, count }) => ({ genre, count }));
          setGenreStats(stats);
          const top =
            stats && stats.length ? stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0]) : { genre: "" };
          setFavoriteGenre(top.genre);
        }
      } catch (err) {
        console.error("통계 조회 중 에러:", err);
      }
    };
    fetchStats();
  }, [memberId]);

  const goArtist = (e, a) => {
    e.stopPropagation();
    if (a?.id) navigate(`/artist/${a.id}`);
  };

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
                        {reviewCount !== null ? `${reviewCount}개` : <Spinner size="sm" />}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        평균 별점
                      </Text>
                      <Text as="div" fontSize="lg" fontWeight="semibold">
                        {averageRating !== null ? `${averageRating.toFixed(1)} ★` : <Spinner size="sm" />}
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
                      <ReviewTrendChart reviews={reviews} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </SimpleGrid>

            {/* 즐겨찾기/참여 앨범 (미니멀 블랙/화이트 카드) */}
            <SimpleGrid columns={[1, 2]} spacing={6} mb={12}>
              {/* 좋아하는 앨범 카드 */}
              <Box
                bg="white"
                color="black"
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="2xl"
                overflow="hidden"
              >
                <Flex
                  align="center"
                  justify="space-between"
                  px={5}
                  py={3}
                  borderBottom="1px solid"
                  borderColor="blackAlpha.200"
                >
                  <Text fontSize="lg" fontWeight="semibold">
                    좋아하는 앨범
                  </Text>
                  {likedAll.length > PREVIEW_COUNT && (
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor="blackAlpha.300"
                      color="black"
                      onClick={likedDisc.onOpen}
                      _hover={{ bg: "black", color: "white", borderColor: "black" }}
                      rounded="md"
                    >
                      전체보기
                    </Button>
                  )}
                </Flex>
                <Box
                  px={4}
                  py={4}
                  sx={{
                    "& > *": {
                      width: "fit-content", // 그리드 너비를 내용만큼만
                      marginInline: "auto", // 가운데 정렬
                    },
                  }}
                >
                  <LikedAlbums />
                </Box>
              </Box>

              {/* 평가한 앨범 카드 */}
              <Box
                bg="white"
                color="black"
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="2xl"
                overflow="hidden"
              >
                <Flex
                  align="center"
                  justify="space-between"
                  px={5}
                  py={3}
                  borderBottom="1px solid"
                  borderColor="blackAlpha.200"
                >
                  <Text fontSize="lg" fontWeight="semibold">
                    평가한 앨범
                  </Text>
                  {reviews.length > PREVIEW_COUNT && (
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor="blackAlpha.300"
                      color="black"
                      onClick={partDisc.onOpen}
                      _hover={{ bg: "black", color: "white", borderColor: "black" }}
                      rounded="md"
                    >
                      전체보기
                    </Button>
                  )}
                </Flex>
                <Box
                  px={4}
                  py={4}
                  sx={{
                    "& > *": {
                      width: "fit-content", // 그리드 너비를 내용만큼만
                      marginInline: "auto", // 가운데 정렬
                    },
                  }}
                >
                  <ParticipatedAlbums />
                </Box>
              </Box>
            </SimpleGrid>
            <RecommendedAlbums />

            {/* ===== 좋아하는 앨범 모달 ===== */}
            <Modal isOpen={likedDisc.isOpen} onClose={likedDisc.onClose} size="5xl" isCentered scrollBehavior="inside">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>내가 좋아하는 앨범 전체보기</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxH="80vh" overflowY="auto" sx={{ overscrollBehaviorY: "contain" }}>
                  <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
                    {likedAll.map((album) => (
                      <VStack
                        key={album.id}
                        spacing={2}
                        align="start"
                        cursor="pointer"
                        onClick={() => {
                          likedDisc.onClose();
                          navigate(`/review/${album.id}`);
                        }}
                      >
                        <Image
                          src={album.imagePath && `http://localhost:8084/${album.imagePath}`}
                          alt={album.title}
                          w="160px"
                          h="160px"
                          objectFit="cover"
                          borderRadius="md"
                          boxShadow="md"
                        />
                        <Text fontWeight="bold" noOfLines={1}>
                          {album.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                          {Array.isArray(album.artists) && album.artists.length > 0
                            ? album.artists.map((a, i) => (
                                <React.Fragment key={a.id ?? `${a.name}-${i}`}>
                                  <Text
                                    as="span"
                                    cursor="pointer"
                                    onClick={(e) => goArtist(e, a)}
                                    _hover={{ color: "black", fontWeight: "medium" }}
                                  >
                                    {a.name}
                                  </Text>
                                  {i < album.artists.length - 1 && ", "}
                                </React.Fragment>
                              ))
                            : ""}
                        </Text>
                      </VStack>
                    ))}
                  </SimpleGrid>
                </ModalBody>
              </ModalContent>
            </Modal>

            {/* ===== 평가한 앨범 모달 ===== */}
            <Modal isOpen={partDisc.isOpen} onClose={partDisc.onClose} size="5xl" isCentered scrollBehavior="inside">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>내가 평가한 앨범 전체보기</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxH="80vh" overflowY="auto" sx={{ overscrollBehaviorY: "contain" }}>
                  <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
                    {reviews.map((r) => (
                      <VStack
                        key={r.id}
                        spacing={2}
                        align="start"
                        cursor="pointer"
                        onClick={() => {
                          partDisc.onClose();
                          navigate(`/review/${r.id}`);
                        }}
                      >
                        <Image
                          src={r.imagePath && `http://localhost:8084/${r.imagePath}`}
                          alt={r.title}
                          w="160px"
                          h="160px"
                          objectFit="cover"
                          borderRadius="md"
                          boxShadow="md"
                        />
                        <Text fontWeight="bold" noOfLines={1}>
                          {r.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                          {r.artists?.map((a, i) => (
                            <React.Fragment key={a.id ?? i}>
                              <Text
                                as="span"
                                cursor="pointer"
                                onClick={(e) => goArtist(e, a)}
                                _hover={{ color: "black", fontWeight: "medium" }}
                              >
                                {a.name}
                              </Text>
                              {i < (r.artists?.length ?? 0) - 1 && ", "}
                            </React.Fragment>
                          ))}
                        </Text>
                      </VStack>
                    ))}
                  </SimpleGrid>
                </ModalBody>
              </ModalContent>
            </Modal>
          </TabPanel>

          {/* ───── AI 음악 비서 탭 ───── */}
          <TabPanel p={0}>
            <Flex gap={6} w="100%" mb="55px">
              <Box flex="1" maxW="615px" h="600px" mt="10px">
                <GuidedChat ref={chatRef} onModeChange={setChatMode} />
              </Box>

              <Box flex="1" h="600px" overflowY={chatMode === "recommend" ? "auto" : "visible"}>
                {chatMode === "translate" && <TrackSearchWithLyrics />}

                {chatMode === "recommend" && (
                  <RecommendPanel onResult={(reply) => chatRef.current?.push({ sender: "BOT", content: reply })} />
                )}

                {/* 유사곡 모드: 오른쪽에 iTunes 검색 패널 표시 */}
                {chatMode === "similar" && (
                  <TrackSearchForSimilar
                    onPick={(seedText, meta) => {
                      // 곡을 클릭하면 좌측 GuidedChat으로 자동 전송
                      chatRef.current?.sendSimilar(seedText, meta);
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
