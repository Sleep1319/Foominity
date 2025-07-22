import React, { useEffect, useState } from "react";
import { Box, Text, HStack, Image, VStack, Spinner, IconButton } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReviewCommentForm from "@/components/commentComponents/ReviewCommentForm";
import CommentList from "@/components/commentComponents/CommenList.jsx";
import LoginRequiredModal from "../siginComponents/LoginRequiredModal";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentKey, setCommentKey] = useState(0);

  // 좋아요 관련 state
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  // 리뷰 상세 조회
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

  // 좋아요 정보 조회 (count, 내가 눌렀는지)
  const fetchLikeInfo = () => {
    axios
      .get(`/api/reviews/${id}/likes`, { withCredentials: true })
      .then((res) => {
        setLikeCount(res.data.count);
        setLiked(res.data.liked);
      })
      .catch((err) => {
        // 좋아요 수는 비로그인이어도 보여주고 싶으니까
        // count만 띄워주는 용도로 fallback (백엔드에서 liked는 false로 리턴)
        if (err.response && err.response.data && err.response.data.count !== undefined) {
          setLikeCount(err.response.data.count);
          setLiked(false);
        } else {
          setLikeCount(0);
          setLiked(false);
        }
      });
  };

  // 좋아요 토글 (401만 모달)
  const handleToggleLike = () => {
    axios
      .post(`/api/reviews/${id}/likes`, null, { withCredentials: true })
      .then(() => {
        // liked 상태를 반대로 바꿈(눌렀으면 true->false, false->true)
        setLiked((prev) => !prev);
        // liked가 true(이미 눌러있던 상태)면 -1, false면 +1
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setModalOpen(true);
        } else {
          console.error("좋아요 토글 실패:", err);
        }
      });
  };

  const handleCommentSuccess = () => {
    fetchReview(); // 댓글 수 업데이트용
    setCommentKey((prev) => prev + 1); // 🔁 key 변경 → CommentList 리렌더 유도
  };

  useEffect(() => {
    fetchReview();
    fetchLikeInfo();
    // eslint-disable-next-line
  }, [id]);

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
                    <strong>Artists:</strong> {review.artists.map((a) => a.name).join(", ")}
                  </Text>
                  <Text fontSize="md" mb={1}>
                    <strong>Genres:</strong> {review.categories.map((c) => c.categoryName).join(", ")}
                  </Text>
                  {/* 좋아요 버튼 & 수 */}
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
          {/* 댓글 작성 컴포넌트 */}
          <ReviewCommentForm reviewId={id} commentCount={review.commentCount || 0} onSuccess={handleCommentSuccess} />
          <CommentList key={commentKey} type="reviews" id={id} />
          <Text
            fontSize="md"
            textAlign="left"
            mt={6}
            mb={6}
            display="inline-block"
            cursor="pointer"
            onClick={() => navigate("/review")}
          >
            목록
          </Text>
        </Box>
      </Box>
      {/* 로그인 필요 모달 */}
      <LoginRequiredModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default ReviewDetail;
