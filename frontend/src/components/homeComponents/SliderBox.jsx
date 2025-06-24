import React, { useRef, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderBoxIndicator from "./SliderBoxIndicator"; // 위치에 따라 경로 조정

const images = ["/images/img1.jpg", "/images/img2.jpg", "/images/img3.jpg", "/images/img4.jpg"];

const SliderBox = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 인덱스 추적

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
    afterChange: (index) => setCurrentIndex(index), // 슬라이드 바뀔 때 index 업데이트
  };

  return (
    <Box w="100vw" h="100vh" overflow="hidden" position="relative">
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
        {images.map((src, idx) => (
          <Box key={idx} w="100%" h="100%">
            <Image
              src={src}
              alt={`slide-${idx}`}
              tabIndex={-1}
              w="100%"
              h="100%"
              objectFit="cover"
              userSelect="none"
              draggable={false}
            />
          </Box>
        ))}
      </Slider>

      {/* 커스텀 도트 인디케이터 */}
      <SliderBoxIndicator total={images.length} currentIndex={currentIndex} />
    </Box>
  );
};

export default SliderBox;
