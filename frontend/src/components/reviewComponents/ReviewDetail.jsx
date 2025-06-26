import React, { useEffect, useState } from "react";
import { Box, Text, HStack, Image, VStack, Spinner } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PopularPosts from "@/components/homeComponents/PopularPosts";
import ReviewCommentForm from "@/components/commentComponents/ReviewCommentForm";
import CommentList from "@/components/commentComponents/CommenList.jsx";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentKey, setCommentKey] = useState(0);

  const fetchReview = () => {
    axios
      .get(`/api/reviews/${id}`)
      .then((res) => {
        setReview(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("리뷰 상세 조회 실패:", err);
        setLoading(false);
      });
  };

  const handleCommentSuccess = () => {
    fetchReview(); // 댓글 수 업데이트용
    setCommentKey(prev => prev + 1); // 🔁 key 변경 → CommentList 리렌더 유도
  };


  useEffect(() => {
    fetchReview();
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
    <Box display="flex" justifyContent="center" px={6} py={10}>
      <Box flex="1" maxW="900px" pr={{ base: 0, lg: 10 }}>
        <Text fontSize="3xl" fontWeight="medium" pb={2} textAlign="center">
          Review
        </Text>

        {/* 앨범 정보 */}
        <Box display="flex" justifyContent="center" px={6} py={10}>
          <Box display="flex" alignItems="flex-end" gap={6}>
            <Image src={review.imagePath} alt={review.title} boxSize="420px" objectFit="cover" borderRadius="md" />
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

        {/* ✅ 댓글 작성 컴포넌트 */}
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
  );
};

export default ReviewDetail;
