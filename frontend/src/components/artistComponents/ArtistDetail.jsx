import React, { useEffect, useState } from "react";
import { Box, Text, VStack, Spinner, Image, Divider } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArtist = () => {
    axios
      .get(`/api/artists/${id}`, { withCredentials: true })
      .then((res) => {
        setArtist(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("아티스트 조회 실패:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!artist) {
    return <Text>아티스트를 찾을 수 없습니다.</Text>;
  }

  return (
    <Box display="flex" justifyContent="center" px={6} py={10}>
      <Box flex="1" maxW="800px">
        <Text fontSize="3xl" fontWeight="bold" pb={4} textAlign="center">
          {artist.name}
        </Text>

        {/* 아티스트 이미지 (있을 경우만) */}
        {artist.imagePath && (
          <Box display="flex" justifyContent="center" mb={6}>
            <Image
              src={`http://localhost:8084/${artist.imagePath}`}
              alt={artist.name}
              boxSize="300px"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>
        )}

        <VStack align="start" spacing={3} px={4}>
          <Text fontSize="md">
            <strong>출생일:</strong> {artist.born || "정보 없음"}
          </Text>
          <Text fontSize="md">
            <strong>국적:</strong> {artist.nationality || "정보 없음"}
          </Text>
        </VStack>

        <Divider my={6} />

        <Text
          fontSize="md"
          textAlign="left"
          mt={4}
          cursor="pointer"
          display="inline-block"
          onClick={() => navigate("/artist")}
        >
          ← 목록으로
        </Text>
      </Box>
    </Box>
  );
};

export default ArtistDetail;
