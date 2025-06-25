import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  HStack,
  Icon,
  useColorModeValue,
  Textarea,
  Image,
  VStack,
  Badge,
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
  const isLoggedIn = false; // 로그인 상태

  const iconColor = useColorModeValue("gray.700", "white");
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
        <Text fontSize="2xl" fontWeight="medium" pb={2} textAlign="left">
          Review
        </Text>

        <Heading as="h1" size="2xl" textAlign="left" pb={2}>
          {review.title}
        </Heading>

        <Box display="flex" alignItems="center" gap={4} pb={4}>
          <Image src={review.imagePath} alt={review.title} boxSize="80px" objectFit="cover" borderRadius="md" />
          <VStack align="start" spacing={1}>
            <Text fontSize="md">
              <strong>Released:</strong> {review.released}
            </Text>
            <Text fontSize="md">
              <strong>Artists:</strong> {review.artists.map((a) => a.name).join(", ")}
            </Text>
            <Text fontSize="md">
              <strong>Genres:</strong> {review.categories.map((c) => c.categoryName).join(", ")}
            </Text>
          </VStack>
        </Box>

        <Divider my={4} />

        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Tracklist
        </Text>
        <Box mb={6}>
          <VStack align="start" spacing={1}>
            {review.tracklist.map((track, idx) => (
              <Text key={idx}>
                {idx + 1}. {track}
              </Text>
            ))}
          </VStack>
        </Box>

        <HStack spacing={1} borderBottom="2px solid gray" pb={4} mb={4}>
          <Icon as={FaRegComment} boxSize={5} color={iconColor} />
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
          ← 목록으로
        </Text>
      </Box>

      <Box display={{ base: "none", lg: "block" }} position="sticky" top="100px" width="250px" alignSelf="flex-start">
        <PopularPosts />
      </Box>
    </Box>
  );
};

export default ReviewDetails;
