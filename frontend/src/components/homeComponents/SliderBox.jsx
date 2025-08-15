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
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const topNotices = notices.slice(0, 4);
  const currentNotice = topNotices[currentIndex];

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

  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (Math.abs(e.clientX - dragStartX.current) > 5) {
      isDragging.current = true;
    }
  };

  const handleClick = (noticeId) => {
    if (!isDragging.current) {
      navigate(`/notice/${noticeId}`);
    }
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

      {/* 슬라이더(움직이는 트랙) */}
      <Slider ref={sliderRef} {...settings}>
        {topNotices.map((notice) => (
          <Box
            key={notice.id}
            w="100%"
            h="100%"
            position="relative"
            cursor="pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => handleClick(notice.id)}
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
            {/* 제목은 이제 밖에서 한 번만 렌더하므로 여기선 제거 */}
          </Box>
        ))}
      </Slider>

      {/* ✅ 제목 + 인디케이터: 트랙 밖(고정 오버레이). 위치는 예전과 동일 */}
      <Box
        position="absolute"
        bottom="120px"
        left="120px"
        color="white"
        textShadow="0 0 10px rgba(0,0,0,0.8)"
        zIndex="1000"
        pointerEvents="none" // 기본은 클릭 통과
      >
        {/* 현재 슬라이드의 제목 표시 */}
        {currentNotice && (
          <Text
            whiteSpace={currentNotice.title?.length >= 70 ? "normal" : "nowrap"}
            overflow="visible"
            maxW="800px"
            lineHeight="1.3"
            fontSize="4xl"
            fontWeight="bold"
          >
            {currentNotice.title}
          </Text>
        )}

        {/* 인디케이터 (제목 아래) — 클릭 가능하도록 래퍼만 pointerEvents 해제 */}
        <Box mt={4} pointerEvents="auto">
          <SliderBoxIndicator
            total={topNotices.length}
            currentIndex={currentIndex}
            onDotClick={handleDotClick}
            useAbsolute={false} // 내부에서 static 렌더 (오버레이가 위치를 잡아줌)
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SliderBox;
