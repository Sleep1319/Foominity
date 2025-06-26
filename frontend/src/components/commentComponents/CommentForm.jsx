import {HStack, Icon, Text, Box, useColorModeValue, Textarea, Button, Flex, IconButton} from "@chakra-ui/react";
import {FaRegComment, FaStar} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const CommentForm = ({ commentCount, isLoggedIn, onSubmit, showStarRating = false }) => {
  const [content, setContent] = useState("");
  const [star, setStar] = useState(0);
  const [hover, setHover] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const payload = showStarRating ? { content, starPoint: star } : { content };
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
            {showStarRating && (
                <HStack mb={2}>
                  {[1, 2, 3, 4, 5].map((value) => (
                      <IconButton
                          key={value}
                          icon={<FaStar />}
                          variant="ghost"
                          aria-label={`${value}점`}
                          onMouseEnter={() => setHover(value)}
                          onMouseLeave={() => setHover(null)}
                          onClick={() => setStar(value)}
                          color={hover >= value || star >= value ? "yellow.400" : "gray.300"}
                      />
                  ))}
                </HStack>
            )}
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              resize="vertical"
              minH="100px"
              mb={3}
            />

            <Flex justify="flex-end">
              <Button colorScheme="teal" onClick={handleSubmit}>
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
            onClick={() => navigate("/login")}
          >
            댓글 쓰기 권한이 없습니다. 로그인 하시겠습니까?
          </Box>
        )}
      </Box>
    </>
  );
};

export default CommentForm;
