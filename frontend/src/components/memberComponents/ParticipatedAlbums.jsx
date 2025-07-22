import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Image, Text, VStack, Spinner, Center } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const ParticipatedAlbums = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/me/participated-albums", { withCredentials: true })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("내가 평가한 앨범 불러오기 실패:", err))
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
  const isLast = currentIndex + slidesToShow >= reviews.length;
  const boxSize = 150;

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="lg" />
        <Text ml={3}>불러오는 중...</Text>
      </Center>
    );
  }

  return (
    <Box maxW="1500px" mx="auto" px={4} py={8}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={4}
        cursor="pointer"
        onClick={() => navigate("/mymusic/participatedalbumslist")}
        // _hover={{
        //   color: "black",
        //   textShadow: "0 0 8px rgba(128, 128, 128, 0.7)",
        // }}
      >
        내가 평가한 앨범
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
              // color="gray.700"
              color="white"
              style={{
                filter: "drop-shadow(0 0 4px #888) drop-shadow(0 0 8px #888)",
              }}
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
              // color="gray.700"
              color="white"
              style={{
                filter: "drop-shadow(0 0 4px #888) drop-shadow(0 0 8px #888)",
              }}
            />
          </Box>
        )}

        <Slider ref={sliderRef} {...settings}>
          {reviews.map((r, idx) => (
            <Box key={r.id} mr={idx === reviews.length - 1 ? 0 : 4}>
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
                <Text fontSize="sm">평균별점: {r.averageStarPoint.toFixed(1)}</Text>
                {/* <Text fontSize="sm" color="purple.600">
                  내 평점: {r.userStarPoint?.toFixed(1) ?? "0.0"}
                </Text> */}
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ParticipatedAlbums;
