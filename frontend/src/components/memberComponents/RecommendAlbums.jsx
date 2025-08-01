// components/memberComponents/RecommendedAlbums.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Image, Text, VStack, Spinner, Center } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const RecommendedAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/me/recommend", { withCredentials: true })
      .then((res) => setAlbums(res.data))
      .catch((err) => console.error("추천 앨범 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  const slidesToShow = 6.5;
  const slidesToScroll = 3.5;
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    arrows: false,
    afterChange: (idx) => setCurrentIndex(idx),
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex + slidesToShow >= albums.length;
  const boxSize = 150;

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="lg" />
        <Text ml={3}>추천 앨범을 불러오는 중...</Text>
      </Center>
    );
  }

  return (
    <Box maxW="1500px" mx="auto" px={4} py={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        내가 좋아할만한 앨범
      </Text>

      <Box position="relative">
        {!isFirst && (
          <Box
            position="absolute"
            top="50%"
            left="-50px"
            transform="translateY(-50%)"
            zIndex="1"
            cursor="pointer"
            onClick={() => sliderRef.current?.slickPrev()}
            p={2}
          >
            <BsChevronLeft
              size={32}
              color="white"
              style={{ filter: "drop-shadow(0 0 4px #888) drop-shadow(0 0 8px #888)" }}
            />
          </Box>
        )}

        {!isLast && (
          <Box
            position="absolute"
            top="50%"
            right="-50px"
            transform="translateY(-50%)"
            zIndex="1"
            cursor="pointer"
            onClick={() => sliderRef.current?.slickNext()}
            p={2}
          >
            <BsChevronRight
              size={32}
              color="white"
              style={{ filter: "drop-shadow(0 0 4px #888) drop-shadow(0 0 8px #888)" }}
            />
          </Box>
        )}

        <Slider ref={sliderRef} {...settings}>
          {albums.map((r, idx) => (
            <Box key={r.id} mr={idx === albums.length - 1 ? 0 : 4}>
              <VStack spacing={2} align="start" w={`${boxSize}px`}>
                <Box w={`${boxSize}px`} h={`${boxSize}px`}>
                  <Image
                    src={r.imagePath ? `http://localhost:8084/${r.imagePath}` : ""}
                    alt={r.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="md"
                    boxShadow="md"
                  />
                </Box>
                <Text fontSize="sm" color="gray.500">
                  #{idx + 1}
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  whiteSpace="normal"
                  noOfLines={2}
                  cursor="pointer"
                  onClick={() => navigate(`/review/${r.id}`)}
                >
                  {r.title}
                </Text>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {r.artists?.map((a) => a.name).join(", ")}
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default RecommendedAlbums;
