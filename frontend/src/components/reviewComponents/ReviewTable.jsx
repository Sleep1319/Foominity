import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Box,
  Text,
  Button,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const ReviewTable = () => {
  const { state, isLoading } = useUser();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("유저 상태 전체 확인:", state);
    if (state) {
      console.log("유저 권한 확인:", state.roleName);
    }

    axios
      .get("/api/reviews?page=0")
      .then((res) => {
        console.log("서버 응답:", res.data);
        setReviews(res.data.content);
      })
      .catch((err) => {
        console.error("리뷰 조회 실패:", err);
      });
  }, []);

  if (isLoading || !state) {
    return (
      <Center h="300px">
        <Spinner size="xl" />
        <Text ml={4}>로딩 중...</Text>
      </Center>
    );
  }

  return (
    <Box>
      {state?.roleName === "ADMIN" && (
        <Box position="fixed" bottom="40px" right="40px" zIndex="999">
          <Button
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
            onClick={() => navigate("/review/create")}
          >
            리뷰 작성
          </Button>
        </Box>
      )}


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
                <Td textAlign="center">{review.artists?.map((artist) => artist.name).join(", ") || "정보 없음"}</Td>
                <Td textAlign="center">
                  {review.categories?.map((category) => category.categoryName).join(", ") || "정보 없음"}
                </Td>
                <Td textAlign="center">
                  {typeof review.averageStarPoint === "number" ? review.averageStarPoint.toFixed(1) : "0.0"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReviewTable;
