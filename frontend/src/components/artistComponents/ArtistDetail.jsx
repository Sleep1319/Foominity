import {
  Box,
  Text,
  VStack,
  Spinner,
  Image,
  Divider,
  Button,
  Flex,
  Heading,
  AspectRatio,
  HStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useUser();

  const [artist, setArtist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, reviewsRes] = await Promise.all([
          axios.get(`/api/artists/${id}`),
          axios.get(`/api/artists/${id}/reviews`),
        ]);
        setArtist(artistRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("아티스트 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`/api/artists/${id}`, { withCredentials: true })
        .then(() => {
          alert("아티스트가 삭제되었습니다.");
          navigate("/review?tab=artist");
        })
        .catch((err) => {
          console.error("아티스트 삭제 실패:", err);
          alert("삭제에 실패했습니다.");
        });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!artist) return <Text>아티스트를 찾을 수 없습니다.</Text>;

  return (
    <Flex justify="center" px={6} py={10} gap={10} flexWrap="wrap">
      {/* 왼쪽: 아티스트 정보 */}
      <Box flex="1" minW="300px" maxW="500px" pt="80px">
        {artist.imagePath && (
          <Box mb={6}>
            <Image
              src={`http://localhost:8084/${artist.imagePath}`}
              alt={artist.name}
              boxSize="300px"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>
        )}

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

        <Text fontSize="3xl" fontWeight="bold" pb={4}>
          {artist.name}
        </Text>
        <VStack align="start" spacing={3} px={4}>
          <Text>
            <strong>출생일:</strong> {artist.born || "정보 없음"}
          </Text>
          <Text>
            <strong>국적:</strong> {artist.nationality || "정보 없음"}
          </Text>
          <Text>
            <strong>장르:</strong> {artist.categories?.map((c) => c.categoryName).join(", ") || "정보 없음"}
          </Text>
        </VStack>

        <Box mt={6}>
          <Button colorScheme="blue" onClick={() => navigate(`/artist/update/${id}`)}>
            수정
          </Button>
        </Box>

        <Divider my={6} />

        <Text fontSize="md" cursor="pointer" onClick={() => navigate(-1)} _hover={{ textDecoration: "underline" }}>
          ← 목록으로
        </Text>
      </Box>

      {/* 오른쪽: 리뷰 리스트 */}
      <Box flex="2" minW="300px" maxW="700px">
        <Heading size="md" mb={4}>
          앨범 리뷰
        </Heading>
        {reviews.length === 0 ? (
          <Text>이 아티스트에 대한 리뷰가 없습니다.</Text>
        ) : (
          <VStack spacing={5} align="stretch">
            {reviews.map((r) => (
              <Flex
                key={r.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="sm"
                align="center"
                _hover={{ boxShadow: "md", bg: "gray.50" }}
                cursor="pointer"
                onClick={() => navigate(`/review/${r.id}`)}
              >
                <Image
                  src={`http://localhost:8084/${r.imagePath}`}
                  alt={r.title}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                  mr={4}
                />
                <Box>
                  <Text fontWeight="bold">{r.title}</Text>
                  <Text fontSize="sm">
                    평점: {typeof r.averageStarPoint === "number" ? r.averageStarPoint.toFixed(1) : "0.0"}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default ArtistDetail;
