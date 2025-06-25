import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, SimpleGrid } from "@chakra-ui/react";
import ReviewList from "./ReviewList";

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("/api/reviews?page=0")
      .then((res) => {
        console.log("서버 응답:", res.data); // 전체 응답 데이터 확인용 로그
        setReviews(res.data.content); // Page 객체의 content 필드가 리뷰 배열이라 가정
      })
      .catch((err) => {
        console.error("리뷰 조회 실패:", err);
      });
  }, []);

  return (
    <Box px={4} py={6}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        {reviews.map((review) => (
          <ReviewList key={review.id} review={review} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ReviewTable;
