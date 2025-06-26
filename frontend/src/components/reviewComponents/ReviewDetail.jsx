import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  HStack,
  Icon,
  useColorModeValue,
  Textarea,
  Image,
  VStack,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import axios from "axios";
import PopularPosts from "@/components/homeComponents/PopularPosts";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = false;

  const textColor = useColorModeValue("gray.700", "white");

  useEffect(() => {
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

        <HStack spacing={1} borderBottom="2px solid gray" pb={4} mb={4}>
          <Text fontSize="lg" color={textColor}>
            평점
          </Text>
          <Text fontSize="lg" color="blue.400">
            {review.averageStarPoint.toFixed(1)}
          </Text>
        </HStack>

        <Box mt={4} borderBottom="2px solid gray" pb={14}>
          <Text fontWeight="bold" mb={2}>
            댓글 달기
          </Text>
          {isLoggedIn ? (
            <Textarea placeholder="댓글을 입력하세요..." />
          ) : (
            <Box
              p={8}
              border="1px solid gray"
              borderRadius="md"
              color="gray.600"
              whiteSpace="pre-wrap"
              minHeight="100px"
              cursor="pointer"
              onClick={() => navigate("/login")}
            >
              댓글 쓰기 권한이 없습니다. 로그인 하시겠습니까?
            </Box>
          )}
        </Box>

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

export default ReviewDetails;
