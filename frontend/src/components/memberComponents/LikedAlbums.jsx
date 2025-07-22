import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LikedAlbums = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  const slidesToShow = 6.5;
  const slidesToScroll = 3.5;

  useEffect(() => {
    axios
      .get("/api/me/liked-albums", { withCredentials: true })
      .then((res) => {
        // imagePath 필드로 통일!
        const mapped = res.data.map((album) => ({
          id: album.id,
          imagePath: album.imagePath || album.coverImage, // 무조건 imagePath 사용
          title: album.title,
          artist: album.artists ? album.artists.map((a) => a.name).join(", ") : "",
        }));
        setAlbums(mapped);
      })
      .catch((err) => {
        console.error("좋아요 앨범 불러오기 실패:", err);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    arrows: false,
    afterChange: (index) => setCurrentIndex(index),
  };

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex + slidesToShow >= albums.length;

  const boxSize = 210;

  return (
    <Box maxW="1500px" mx="auto" px={4} py={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        내가 좋아하는 앨범
      </Text>

      <Box position="relative">
        {!isFirstSlide && (
          <Box
            position="absolute"
            top="50%"
            left="-70px"
            transform="translateY(-50%)"
            zIndex="999"
            cursor="pointer"
            onClick={() => sliderRef.current?.slickPrev()}
            p={2}
          >
            <BsChevronLeft
              size={40}
              color="white"
              style={{
                filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
              }}
            />
          </Box>
        )}

        {!isLastSlide && (
          <Box
            position="absolute"
            top="50%"
            right="-70px"
            transform="translateY(-50%)"
            zIndex="999"
            cursor="pointer"
            onClick={() => sliderRef.current?.slickNext()}
            p={2}
          >
            <BsChevronRight
              size={40}
              color="white"
              style={{
                filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
              }}
            />
          </Box>
        )}

        <Slider ref={sliderRef} {...settings}>
          {albums.map((album, index) => (
            <Box key={album.id} mr={index === albums.length - 1 ? 0 : 4}>
              <VStack spacing={2} align="start" w={`${boxSize}px`}>
                <Box w={`${boxSize}px`} h={`${boxSize}px`}>
                  <Image
                    // src={album.coverImage}
                    src={album.imagePath ? `http://localhost:8084/${album.imagePath}` : ""}
                    alt={album.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="md"
                    boxShadow="md"
                  />
                </Box>
                <Text fontSize="sm" color="gray.500">
                  #{index + 1}
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  whiteSpace="normal"
                  noOfLines={2}
                  cursor="pointer"
                  onClick={() => navigate(`/review/${album.id}`)}
                >
                  {album.title}
                </Text>
                <Text fontSize="md" color="gray.600" whiteSpace="normal">
                  {album.artist}
                </Text>
                {/* <Text fontSize="sm">평균별점: {album.averageStarPoint.toFixed(1)}</Text> */}
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default LikedAlbums;
