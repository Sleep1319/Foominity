import { HStack, Icon, Text, Box, useColorModeValue, Textarea, Button, Flex, IconButton } from "@chakra-ui/react";
import { FaRegComment, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

/** 0.5 단위 별점 컴포넌트 */
const StarRating = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(null);

  const handleMove = (e, i) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width; // 0 ~ 1
    const half = pct <= 0.5 ? i - 0.5 : i; // i는 1~5
    setHover(half);
  };

  const handleClick = () => {
    if (hover != null && onChange) onChange(hover);
  };

  const display = hover ?? value; // 보여줄 값(호버 중이면 호버 우선)

  return (
    <HStack mb={2}>
      {[1, 2, 3, 4, 5].map((i) => {
        const full = display >= i;
        const half = !full && display >= i - 0.5;
        const icon = full ? FaStar : half ? FaStarHalfAlt : FaRegStar;
        const color = full || half ? "yellow.400" : "gray.300";

        return (
          <IconButton
            key={i}
            icon={<Icon as={icon} boxSize={5} />}
            variant="ghost"
            aria-label={`${i}번째 별`}
            onMouseMove={(e) => handleMove(e, i)}
            onMouseLeave={() => setHover(null)}
            onClick={handleClick}
            color={color}
            // 키보드 접근성 (← → 로 0.5 단위 조절)
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") onChange(Math.min(5, (value || 0) + 0.5));
              if (e.key === "ArrowLeft") onChange(Math.max(0.5, (value || 0) - 0.5));
            }}
          />
        );
      })}
    </HStack>
  );
};

const CommentForm = ({ commentCount, isLoggedIn, onSubmit, showStarRating = false }) => {
  const [content, setContent] = useState("");
  const [star, setStar] = useState(0); // 0.5 ~ 5.0
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // 0.5 단위 보장 (혹시 모를 부동소수점 보정)
    const fixedStar = Math.round(star * 2) / 2;

    const payload = showStarRating ? { content, starPoint: fixedStar } : { content };

    onSubmit(payload);
    setContent("");
    setStar(0);
  };
  return (
    <>
      <HStack mt={4} spacing={1} borderBottom="2px solid gray" pb={4}>
        <Icon as={FaRegComment} boxSize={5} color={useColorModeValue("gray.700", "white")} />
        <Text fontSize="lg" color={useColorModeValue("gray.700", "white")}>
          댓글
        </Text>
        <Text fontSize="lg" color="blue.400">
          {commentCount}
        </Text>
      </HStack>

      <Box mt={4} borderBottom="2px solid gray" pb={14}>
        <Text fontWeight="bold" mb={2}>
          댓글 달기
        </Text>

        {isLoggedIn ? (
          <>
            {showStarRating && <StarRating value={star} onChange={setStar} />}

            <Textarea
              placeholder="댓글을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              resize="vertical"
              minH="100px"
              mb={3}
            />

            <Flex justify="flex-end" align="center" gap={3}>
              {showStarRating && (
                <Text fontSize="sm" color="gray.500">
                  현재 별점: {star ? star.toFixed(1) : "없음"} / 5.0
                </Text>
              )}
              <Button
                color="white"
                bg="black"
                size="sm"
                fontSize="sm"
                _hover={{ bg: "black", color: "white" }}
                onClick={handleSubmit}
              >
                등록
              </Button>
            </Flex>
          </>
        ) : (
          <Box
            p={8}
            border="1px solid gray"
            borderRadius="md"
            color="gray.600"
            whiteSpace="pre-wrap"
            minHeight="100px"
            cursor="pointer"
            onClick={() => navigate("/loginpage")}
          >
            댓글 쓰기 권한이 없습니다. 로그인 하시겠습니까?
          </Box>
        )}
      </Box>
    </>
  );
};

export default CommentForm;
