import React, { useRef, useState } from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderBoxIndicator from "./SliderBoxIndicator";

const SliderBox = ({ notices = [] }) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const topNotices = notices.slice(0, 4);

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    fade: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    accessibility: false,
    afterChange: (index) => setCurrentIndex(index),
  };

  const handleDotClick = (index) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <Box w="100%" h="100vh" overflow="hidden" position="relative">
      {/* 왼쪽 화살표 */}
      <Box
        position="absolute"
        top="50%"
        left="24px"
        transform="translateY(-50%)"
        zIndex="999"
        cursor="pointer"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <BsChevronLeft
          size={36}
          color="white"
          style={{
            filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
          }}
        />
      </Box>

      {/* 오른쪽 화살표 */}
      <Box
        position="absolute"
        top="50%"
        right="24px"
        transform="translateY(-50%)"
        zIndex="999"
        cursor="pointer"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <BsChevronRight
          size={36}
          color="white"
          style={{
            filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
          }}
        />
      </Box>

      {/* 슬라이더 */}
      <Slider ref={sliderRef} {...settings}>
        {topNotices.map((notice) => (
          <Box
            key={notice.id}
            w="100%"
            h="100%"
            position="relative"
            cursor="pointer"
            onClick={() => navigate(`/notice/${notice.id}`)}
          >
            <Image
              src={`http://localhost:8084/${notice.imagePath}`}
              alt={notice.title}
              w="2000px"
              h="960px"
              objectFit="cover"
              draggable={false}
              userSelect="none"
            />
            <Box position="absolute" bottom="120px" left="120px" color="white" textShadow="0 0 10px rgba(0,0,0,0.8)">
              <Text
                whiteSpace={notice.title.length >= 70 ? "normal" : "nowrap"}
                overflow="visible"
                maxW="800px"
                lineHeight="1.3"
                fontSize="4xl"
                fontWeight="bold"
              >
                {notice.title}
              </Text>
              <Box mt={4}>
                <SliderBoxIndicator
                  total={topNotices.length}
                  currentIndex={currentIndex}
                  onDotClick={handleDotClick}
                  useAbsolute={false}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SliderBox;
