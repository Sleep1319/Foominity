import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const TopRankedAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/reviews/top-albums")
      .then((res) => setAlbums(res.data))
      .catch((err) => console.error("Top10 불러오기 실패:", err));
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
  const boxSize = 160;

  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (Math.abs(e.clientX - dragStartX.current) > 5) {
      isDragging.current = true;
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 0);
  };

  return (
    <Box maxW="1500px" mx="auto" px={4} py={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Top Ranked Albums
      </Text>

      <Box position="relative">
        {!isFirst && (
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

        {!isLast && (
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
          {albums.map((a, i) => (
            <Box key={a.id} mr={i === albums.length - 1 ? 0 : 4}>
              <VStack
                spacing={2}
                align="start"
                cursor="pointer"
                w={`${boxSize}px`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={(e) => {
                  if (isDragging.current) {
                    e.preventDefault();
                    return;
                  }
                  navigate(`/review/${a.id}`);
                }}
              >
                <Box w={`${boxSize}px`} h={`${boxSize}px`}>
                  <Image
                    src={a.imagePath ? `http://localhost:8084/${a.imagePath}` : ""}
                    alt={a.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="md"
                    boxShadow="md"
                    pointerEvents="none"
                  />
                </Box>
                <Text fontSize="2xl" color="gray.600" fontWeight="bold">
                  #{i + 1}
                </Text>
                <Text fontSize="lg" fontWeight="semibold" whiteSpace="normal">
                  {a.title}
                </Text>
                <Text fontSize="md" color="gray.600" whiteSpace="normal">
                  {a.artists.map((ar) => ar.name).join(", ")}
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default TopRankedAlbums;
