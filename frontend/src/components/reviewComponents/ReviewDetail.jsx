import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  HStack,
  Image,
  VStack,
  Spinner,
  IconButton,
  Grid,
  GridItem,
  AspectRatio,
  Divider,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReviewCommentForm from "@/components/commentComponents/ReviewCommentForm";
import CommentList from "@/components/commentComponents/CommentList.jsx";
import LoginRequiredModal from "../siginComponents/LoginRequiredModal";
import { useUser } from "@/redux/useUser.js";
import RefreshButton from "@/components/ui/RefreshButton";
import RatingSummaryStar from "../ui/RatingSummaryStar";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useUser(); // ✅ 관리자 확인용
  const [isModalOpen, setModalOpen] = useState(false);

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentKey, setCommentKey] = useState(0);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const [recommendations, setRecommendations] = useState([]);

  // 댓글 갯수
  const [commentCount, setCommentCount] = useState(0);

  const fetchReview = () => {
    axios
      .get(`/api/reviews/${id}`, { withCredentials: true })
      .then((res) => {
        setReview(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("리뷰 상세 조회 실패:", err);
        setLoading(false);
      });
  };

  const fetchLikeInfo = () => {
    axios
      .get(`/api/reviews/${id}/likes`, { withCredentials: true })
      .then((res) => {
        setLikeCount(res.data.count);
        setLiked(res.data.liked);
      })
      .catch((err) => {
        if (err.response?.data?.count !== undefined) {
          setLikeCount(err.response.data.count);
          setLiked(false);
        } else {
          setLikeCount(0);
          setLiked(false);
        }
      });
  };

  const handleToggleLike = () => {
    axios
      .post(`/api/reviews/${id}/likes`, null, { withCredentials: true })
      .then(() => {
        setLiked((prev) => {
          setLikeCount((count) => (prev ? count - 1 : count + 1));
          return !prev;
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setModalOpen(true);
        } else {
          console.error("좋아요 토글 실패:", err);
        }
      });
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`/api/reviews/${id}`, { withCredentials: true })
        .then(() => {
          alert("리뷰가 삭제되었습니다.");
          navigate("/review");
        })
        .catch((err) => {
          console.error("리뷰 삭제 실패:", err);
          alert("삭제에 실패했습니다.");
        });
    }
  };

  const handleCommentSuccess = () => {
    fetchReview();
    setCommentKey((prev) => prev + 1);
  };

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`/api/reviews/${id}/recommend`);
      console.log("🎯 추천 앨범 리스트:", res.data);
      setRecommendations(res.data);
    } catch (err) {
      console.error("추천 앨범 불러오기 실패:", err);
    }
  };

  const parseDuration = (s) => {
    const m = s.match(/(\d{1,2}:\d{2})\s*$/);
    return m ? m[1] : "";
  };

  const parseFeatures = (s) => {
    // (feat. XXX) 또는 with XXX 패턴 지원
    const m = s.match(/\((?:feat\.?|Feat\.?)\s*([^)]*)\)|\bwith\s+(.+)$/i);
    return m ? m[1] || m[2] : "";
  };

  const parseTitle = (s) => {
    // 뒤쪽의 duration, (feat …), with … 제거
    return s
      .replace(/\s*\((?:feat\.?|Feat\.?).*?\)\s*$/i, "")
      .replace(/\s*with\s+.+$/i, "")
      .replace(/\s*\d{1,2}:\d{2}\s*$/, "")
      .trim();
  };

  useEffect(() => {
    fetchReview();
    fetchLikeInfo();
    fetchRecommendations();
  }, [id]);

  // 댓글 갯수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: count } = await axios.get(`/api/reviews/${id}/comments/count`);
        setCommentCount(count);
      } catch (err) {
        console.error("댓글 수 불러오기 실패:", err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (recommendations.length > 0) {
      recommendations.forEach((album) => {
        console.log("✅ 추천 앨범 제목:", album.title);
      });
    }
  }, [recommendations]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!review) {
    return <Text>리뷰를 찾을 수 없습니다.</Text>;
  }

  return (
    <>
      <Box display="flex" justifyContent="center" px={6} py={10}>
        <Box flex="1" maxW="1200px" pr={{ base: 0, lg: 10 }}>
          <Text fontSize="3xl" fontWeight="medium" pb={2} textAlign="center">
            Review
          </Text>

          {/* ✅ 삭제 버튼: 관리자만 */}
          {state?.roleName === "ADMIN" && (
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Text
                fontSize="sm"
                color="red.500"
                cursor="pointer"
                onClick={handleDelete}
                _hover={{ textDecoration: "underline" }}
              >
                삭제하기
              </Text>
            </Box>
          )}

          {/* 앨범 정보 */}
          {/* 앨범 정보 (고정 규격 3-열 레이아웃) */}
          <Box px={6} py={10} display="flex" justifyContent="center">
            <Box w="100%" maxW="1200px">
              <Grid
                templateColumns={{ base: "1fr", lg: "420px 1fr 320px" }} // 좌(커버) / 중(정보) / 우(트랙)
                gap={{ base: 6, lg: 10 }}
                alignItems="end"
              >
                {/* 왼쪽: 커버(정사각, 고정 크기) */}
                <GridItem>
                  <AspectRatio ratio={1} w={{ base: "80%", md: "380px", lg: "420px" }} maxW="420px">
                    <Image
                      src={review.imagePath ? `http://localhost:8084/${review.imagePath}` : ""}
                      alt={review.title}
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </AspectRatio>
                </GridItem>

                {/* 가운데: 앨범 정보(높이 맞춤) */}
                <GridItem>
                  <VStack
                    align="start"
                    justify="flex-start"
                    spacing={2}
                    h={{ base: "auto", lg: "420px" }} // 커버와 동일 높이로 맞춤
                  >
                    <Text
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="bold"
                      noOfLines={4}
                      fontFamily="Georgia, serif"
                      fontStyle="italic"
                    >
                      {review.title}
                    </Text>

                    <Divider my={0.5} borderColor="gray.500" />

                    <Text fontSize="md">
                      <strong>발매일 :</strong> {review.released}
                    </Text>

                    <Text fontSize="md">
                      <strong>아티스트 :</strong>{" "}
                      {review.artists.map((a, idx) => (
                        <Box
                          as="span"
                          key={a.id}
                          fontWeight="600"
                          // color="blue.600"
                          // textDecoration="underline"
                          cursor="pointer"
                          mr="6px"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/artist/${a.id}`);
                          }}
                        >
                          {a.name}
                          {idx < review.artists.length - 1 ? "," : ""}
                        </Box>
                      ))}
                    </Text>

                    <Text fontSize="md">
                      <strong>장르 :</strong> {review.categories.map((c) => c.categoryName).join(", ")}
                    </Text>
                    <Text fontSize="md" display="flex" alignItems="center" gap="8px">
                      <RatingSummaryStar value={review.averageStarPoint || 0} />
                      <Text as="span" fontWeight="semibold">
                        {typeof review.averageStarPoint === "number" ? review.averageStarPoint.toFixed(2) : "0.00"}
                      </Text>
                      <Text as="span" color="gray.600">
                        / 5.0
                      </Text>
                      <Text as="span" color="gray.500">
                        from {commentCount} ratings
                      </Text>
                    </Text>

                    {/* 좋아요 버튼 영역 */}
                    <Box mt="auto" alignSelf="center">
                      <HStack spacing={2}>
                        <IconButton
                          aria-label={liked ? "좋아요 취소" : "좋아요"}
                          icon={liked ? <FaHeart /> : <FaRegHeart />}
                          colorScheme={liked ? "red" : "gray"}
                          fontSize="24px"
                          onClick={handleToggleLike}
                        />
                        <Text fontSize="md">{likeCount}</Text>
                      </HStack>
                    </Box>
                  </VStack>
                </GridItem>

                {/* 오른쪽: 트랙리스트(동일 높이 + 내부 스크롤) */}
                {/* 오른쪽: 트랙리스트 (블록 스타일) */}
                <GridItem>
                  <Box h={{ base: "auto", lg: "420px" }} display="flex" flexDir="column">
                    <Text fontSize="xl" fontWeight="semibold" mb={2} fontFamily="Georgia, serif" fontStyle="italic">
                      Tracklist
                    </Text>

                    <VStack
                      align="stretch"
                      spacing={0}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      overflow="hidden"
                      maxH={{ base: "unset", lg: "400px" }} // 리스트 영역 높이 고정
                      overflowY="auto"
                    >
                      {review.tracklist.map((raw, idx) => {
                        const title = parseTitle(raw);
                        const duration = parseDuration(raw);
                        const features = parseFeatures(raw);

                        return (
                          <Box
                            key={idx}
                            bg={"white"} // 줄마다 배경 번갈아
                            px={3}
                            py={2}
                          >
                            <HStack align="baseline" spacing={3}>
                              {/* 트랙 번호 */}
                              <Box
                                w="24px"
                                textAlign="right"
                                fontWeight="semibold"
                                color="gray.600"
                                fontFamily="'Times New Roman', serif"
                                fontStyle="italic"
                              >
                                {idx + 1}
                              </Box>

                              {/* 제목/시간/피쳐링 */}
                              <VStack align="start" spacing={0} flex="1">
                                <HStack w="100%" align="baseline">
                                  <Text
                                    fontWeight="medium"
                                    color="black"
                                    // fontFamily="'Times New Roman', serif"
                                    // fontStyle="italic"
                                  >
                                    {title || raw}
                                  </Text>
                                  {duration && (
                                    <Text fontSize="sm" color="gray.300" ml="auto">
                                      {duration}
                                    </Text>
                                  )}
                                </HStack>

                                {features && (
                                  <Text fontSize="sm" color="gray.600">
                                    with{" "}
                                    <Text as="span" fontWeight="semibold">
                                      {features}
                                    </Text>
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          </Box>

          <Divider my={0} borderColor="black" />

          <Box mt={10}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              유사한 앨범 추천
              <RefreshButton onClick={fetchRecommendations} />
            </Text>
            {recommendations.length === 0 ? (
              <Text>추천 앨범이 없습니다.</Text>
            ) : (
              <HStack spacing={4} overflowX="auto">
                {recommendations.map((album) => (
                  <Box
                    key={album.id}
                    onClick={() => navigate(`/review/${album.id}`)}
                    cursor="pointer"
                    borderWidth="1px"
                    borderRadius="md"
                    overflow="hidden"
                    minW="200px"
                    w="200px"
                    h="280px" // ✅ 전체 박스 높이 고정
                  >
                    <Image
                      src={album.imagePath ? `http://localhost:8084/${album.imagePath}` : ""}
                      alt={album.title}
                      boxSize="200px"
                      objectFit="cover"
                    />

                    <Box p={2} h="60px">
                      {" "}
                      {/* ✅ 텍스트 영역 높이 고정 */}
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        whiteSpace="normal"
                        wordBreak="break-word"
                        lineHeight="1.2"
                        noOfLines={2} // ✅ 최대 2줄
                      >
                        {album.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600" isTruncated>
                        {album.artists.map((a) => a.name).join(", ")}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </HStack>
            )}
          </Box>

          <ReviewCommentForm reviewId={id} commentCount={review.commentCount || 0} onSuccess={handleCommentSuccess} />
          <CommentList key={commentKey} type="reviews" id={id} />

          <Text
            fontSize="md"
            cursor="pointer"
            onClick={() => navigate("/review?tab=review")}
            _hover={{ textDecoration: "underline" }}
          >
            ← 목록으로
          </Text>
        </Box>
      </Box>

      <LoginRequiredModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default ReviewDetail;
