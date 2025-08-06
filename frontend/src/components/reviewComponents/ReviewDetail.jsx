import React, { useEffect, useState } from "react";
import { Box, Text, HStack, Image, VStack, Spinner, IconButton } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReviewCommentForm from "@/components/commentComponents/ReviewCommentForm";
import CommentList from "@/components/commentComponents/CommentList.jsx";
import LoginRequiredModal from "../siginComponents/LoginRequiredModal";
import { useUser } from "@/context/UserContext";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useUser(); // 관리자 확인용
  const [isModalOpen, setModalOpen] = useState(false);

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentKey, setCommentKey] = useState(0);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const [recommendations, setRecommendations] = useState([]);

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

  useEffect(() => {
    fetchReview();
    fetchLikeInfo();

    axios
      .get(`/api/reviews/${id}/recommend`)
      .then((res) => {
        console.log("🎯 추천 앨범 리스트:", res.data);
        setRecommendations(res.data);
      })
      .catch((err) => console.error("추천 앨범 불러오기 실패:", err));
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
        <Box flex="1" maxW="900px" pr={{ base: 0, lg: 10 }}>
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
          <Box display="flex" justifyContent="center" px={6} py={10}>
            <Box display="flex" alignItems="flex-end" gap={6}>
              <Image
                src={review.imagePath ? `http://localhost:8084/${review.imagePath}` : ""}
                alt={review.title}
                boxSize="420px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box display="flex" flexDirection="row" alignItems="flex-end" gap={8} h="420px">
                <Box display="flex" flexDirection="column" justifyContent="flex-end">
                  <Text fontSize="3xl" fontWeight="bold" mb={2}>
                    {review.title}
                  </Text>
                  <Text fontSize="md" mb={1}>
                    <strong>Released:</strong> {review.released}
                  </Text>
                  <Text fontSize="md" mb={1}>
                    <strong>Artists:</strong>{" "}
                    {review.artists.map((a, idx) => (
                      <span
                        key={a.id}
                        style={{
                          fontWeight: "600",
                          color: "#3182ce", // Chakra의 blue.600
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginRight: "6px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // 상위 박스 클릭 방지
                          navigate(`/artist/${a.id}`);
                        }}
                      >
                        {a.name}
                        {idx < review.artists.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </Text>

                  <Text fontSize="md" mb={1}>
                    <strong>Genres:</strong> {review.categories.map((c) => c.categoryName).join(", ")}
                  </Text>

                  <HStack spacing={2} mt={4} justifyContent="center" alignItems="center">
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

                <Box display="flex" flexDirection="column" justifyContent="flex-end">
                  <Text fontSize="xl" fontWeight="semibold" mb={2}>
                    Tracklist
                  </Text>
                  <VStack align="start" spacing={1}>
                    {review.tracklist.map((track, idx) => (
                      <Text key={idx} fontSize="sm">
                        {idx + 1}. {track}
                      </Text>
                    ))}
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box mt={10}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              유사한 앨범 추천
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
