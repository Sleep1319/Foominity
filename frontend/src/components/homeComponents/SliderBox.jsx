import { Box, Image } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useRef } from 'react';
import Slider from 'react-slick';

const images = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
];

const SliderBox = () => {
  const sliderRef = useRef(null);

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    fade: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    pauseOnHover: false,
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
            filter:
              "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
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
            filter:
              "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
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
              w="100%"
              h="100%"
              objectFit="cover"
              userSelect="none"
              draggable={false}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SliderBox;
