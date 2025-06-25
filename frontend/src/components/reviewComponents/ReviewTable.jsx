import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Image, Box, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

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
    <TableContainer>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th textAlign="center">번호</Th>
            <Th textAlign="center">앨범</Th>
            <Th textAlign="center">아티스트</Th>
            <Th textAlign="center">장르</Th>
            <Th textAlign="center">평점</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviews.map((review, index) => (
            <Tr key={review.id}>
              <Td textAlign="center">{index + 1}</Td>
              <Td textAlign="center">
                <RouterLink to={`/review/${review.id}`}>
                  <Box display="flex" alignItems="center" gap={3} justifyContent="center">
                    <Image
                      src={review.imagePath || ""}
                      alt={review.title}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <Text>{review.title}</Text>
                  </Box>
                </RouterLink>
              </Td>
              <Td textAlign="center">
                {review.artists && review.artists.length > 0
                  ? review.artists.map((artist) => artist.name).join(", ")
                  : "정보 없음"}
              </Td>
              <Td textAlign="center">
                {review.categories && review.categories.length > 0
                  ? review.categories.map((category) => category.categoryName).join(", ")
                  : "정보 없음"}
              </Td>
              <Td textAlign="center">
                {typeof review.averageStarPoint === "number" ? review.averageStarPoint.toFixed(1) : "0.0"}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ReviewTable;
