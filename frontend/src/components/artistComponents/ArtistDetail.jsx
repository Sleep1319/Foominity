import { Box, Text, VStack, Spinner, Image, Divider } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/artists/${id}`)
      .then((res) => {
        setArtist(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("아티스트 조회 실패:", err);
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
  if (!artist) return <Text>아티스트를 찾을 수 없습니다.</Text>;

  return (
    <Box display="flex" justifyContent="center" px={6} py={10}>
      <Box flex="1" maxW="1000px" pt="80px">
        {/* 이미지 */}
        {artist.imagePath && (
          <Box display="flex" mb={6}>
            <Image
              src={`http://localhost:8084/${artist.imagePath}`}
              alt={artist.name}
              boxSize="300px"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>
        )}
        <Text fontSize="3xl" fontWeight="bold" pb={4}>
          {artist.name}
        </Text>

        {/* 상세 필드 */}
        <VStack align="start" spacing={3} px={4}>
          <Text fontSize="md">
            <strong>출생일:</strong> {artist.born || "정보 없음"}
          </Text>
          <Text fontSize="md">
            <strong>국적:</strong> {artist.nationality || "정보 없음"}
          </Text>
          <Text fontSize="md">
            <strong>장르:</strong> {artist.categories?.map((c) => c.categoryName).join(", ") || "정보 없음"}
          </Text>
        </VStack>

        <Divider my={6} />

        {/* 뒤로가기 */}
        <Text fontSize="md" cursor="pointer" onClick={() => navigate(-1)} _hover={{ textDecoration: "underline" }}>
          ← 목록으로
        </Text>
      </Box>
    </Box>
  );
};

export default ArtistDetail;
