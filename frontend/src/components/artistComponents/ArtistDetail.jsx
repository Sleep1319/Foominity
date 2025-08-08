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
  SimpleGrid,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser} from "@/redux/useUser.js";
import RefreshButton from "@/components/ui/RefreshButton";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useUser();

  const [artist, setArtist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, reviewsRes, recommendRes] = await Promise.all([
          axios.get(`/api/artists/${id}`),
          axios.get(`/api/artists/${id}/reviews`),
        ]);
        setArtist(artistRes.data);
        setReviews(reviewsRes.data);
        await fetchRecommendations();
      } catch (err) {
        console.error("아티스트 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`/api/artists/${id}/recommend`);
      setRecommendations(res.data);
    } catch (err) {
      console.error("추천 아티스트 불러오기 실패:", err);
    }
  };

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
    <Box maxW="1200px" mx="auto" px={4} py={10}>
      {/* 상단 영역: 아티스트 정보 + 리뷰 리스트 */}
      <Flex gap={10} align="start" mt={10} h="520px">
        {/* 왼쪽: 아티스트 정보 */}
        <Box w="40%" minW="300px">
          {artist.imagePath && (
            <Image
              src={`http://localhost:8084/${artist.imagePath}`}
              alt={artist.name}
              boxSize="300px"
              objectFit="cover"
              borderRadius="md"
              mb={6}
            />
          )}

          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            {artist.name}
          </Text>

          <VStack align="start" spacing={3}>
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

          <Divider my={6} />
        </Box>

        {/* 오른쪽: 리뷰 리스트 (스크롤 영역) */}
        <Box w="60%" h="100%" overflowY="auto" pr={2}>
          <Heading size="md" mb={4}>
            아티스트의 앨범
          </Heading>

          {reviews.length === 0 ? (
            <Text>이 아티스트에 대한 리뷰가 없습니다.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
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

      {/* 유사한 아티스트 */}
      <Box mt={16}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          유사한 아티스트
          <RefreshButton onClick={fetchRecommendations} />
        </Text>
        {recommendations.length === 0 ? (
          <Text>추천 아티스트가 없습니다.</Text>
        ) : (
          <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={6}>
            {recommendations.map((rec) => (
              <Box
                key={rec.id}
                onClick={() => navigate(`/artist/${rec.id}`)}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                h="280px"
              >
                <Image
                  src={rec.imagePath ? `http://localhost:8084/${rec.imagePath}` : ""}
                  alt={rec.name}
                  boxSize="200px"
                  objectFit="cover"
                />
                <Box p={2}>
                  <Text fontSize="md" fontWeight="semibold" noOfLines={2}>
                    {rec.name}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}

        <Divider my={6} />

        <Text
          fontSize="md"
          cursor="pointer"
          onClick={() => navigate("/review?tab=artist")}
          _hover={{ textDecoration: "underline" }}
        >
          ← 목록으로
        </Text>

        {/* 수정 버튼은 맨 하단에, 관리자만 노출 */}
        {state?.roleName === "ADMIN" && (
          <Box textAlign="right" mt={6}>
            <Button colorScheme="blue" onClick={() => navigate(`/artist/update/${id}`)}>
              수정
            </Button>
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
      </Box>
    </Box>
  );
};

export default ArtistDetail;
