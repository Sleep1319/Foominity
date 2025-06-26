import React, { useEffect, useState } from "react";
import { Box, Text, Heading, HStack, Icon, useColorModeValue, Textarea, Spinner, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegComment } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import axios from "axios";

const BoardDetail = () => {
  const { state: user } = useUser();
  const loginMemberId = user?.memberId;

  const { id } = useParams(); // URL에서 게시글 id 추출
  const navigate = useNavigate();
  const isLoggedIn = false;

  const grayText = useColorModeValue("gray.700", "white");
  const blueText = useColorModeValue("blue.400", "blue.200");

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        // 백엔드에서 해당 id의 게시글 정보를 GET으로 가져옵니다
        const res = await axios.get(`/api/board/${id}`);
        setBoard(res.data);
      } catch (err) {
        console.error(err);
        setBoard(null);
      }
      setLoading(false);
    };
    fetchBoard();
  }, [id]);

  if (loading) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!board) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xl" color="gray.500">
          게시글을 찾을 수 없습니다.
        </Text>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" px={6} py={10}>
      <Box flex="1" maxW="900px">
        <Text fontSize="2xl" fontWeight="medium" pb={2} textAlign="left">
          자유게시판
        </Text>
        <Heading as="h1" size="2xl" textAlign="left" pb={2}>
          {board.title}
        </Heading>
        <Box
          display="flex"
          textAlign="left"
          fontSize="lg"
          fontWeight="light"
          mt={2}
          borderBottom="1px solid gray"
          pb={4}
        >
          <Text pr={4}>{board.nickname}</Text>
          <Text px={4}>{board.createDate?.split("T")[0]}</Text>
          <Text px={4}>
            <Icon as={FaRegEye} mr={1} />
            {board.views / 2}
          </Text>
          <Text px={4}>
            <Icon as={FaRegComment} mr={1} />
            {board.commentCount ?? 0}
          </Text>
        </Box>

        <Box mt={18}>
          <Text fontSize="md" whiteSpace="pre-wrap" textAlign="left" borderBottom="1px solid gray" pb={4}>
            {board.content}
          </Text>
        </Box>

        <Text
          fontSize="md"
          textAlign="left"
          mt={6}
          mb={6}
          display="inline-block"
          cursor="pointer"
          onClick={() => navigate("/board")}
        >
          목록
        </Text>

        {/* 수정 버튼 조건부 표시 */}
        {String(loginMemberId) === String(board.memberId) && (
          <Button colorScheme="teal" size="sm" ml={2} onClick={() => navigate(`/board/update/${board.id}`)}>
            수정
          </Button>
        )}

        <HStack mt={4} spacing={1} borderBottom="2px solid gray" pb={4}>
          <Icon as={FaRegComment} boxSize={5} color={grayText} />
          <Text fontSize="lg" color={grayText}>
            댓글
          </Text>
          <Text fontSize="lg" color={blueText}>
            {board.commentCount ?? 0}
          </Text>
        </HStack>

        <Box mt={4} borderBottom="2px solid gray" pb={14}>
          <Text fontWeight="bold" mb={2}>
            댓글 달기
          </Text>
          {isLoggedIn ? (
            <Textarea placeholder="댓글을 입력하세요..." />
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
      </Box>
    </Box>
  );
};

export default BoardDetail;
