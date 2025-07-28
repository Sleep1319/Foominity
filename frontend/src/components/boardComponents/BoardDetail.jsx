import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  HStack,
  Icon,
  useColorModeValue,
  Textarea,
  Spinner,
  Button,
  Flex,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegComment } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import BoardCommentForm from "@/components/commentComponents/BoardCommentForm.jsx";
import CommentList from "@/components/commentComponents/CommenList.jsx";
import BoardList from "./BoardList";
import { Viewer } from "@toast-ui/react-editor";

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
  const [commentKey, setCommentKey] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

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

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`/api/board/delete/${id}`, { withCredentials: true });
      toast({
        title: "게시글이 삭제되었습니다.",
        status: "info",
        duration: 1500,
        isClosable: true,
      });
      navigate("/board");
    } catch (err) {
      console.log(err);
      setError("삭제에 실패했습니다. 다시 시도해주세요.");
    }
    setIsSubmitting(false);
  };

  const handleCommentSuccess = () => {
    fetchBoard(); // 댓글 수 업데이트용
    setCommentKey((prev) => prev + 1); // 🔁 key 변경 → CommentList 리렌더 유도
  };

  useEffect(() => {
    fetchBoard();
    window.scrollTo(0, 0);
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
        <Box
          as="button"
          w="100%"
          py={8}
          border="none"
          background="none"
          borderBottom="1px solid gray"
          cursor="pointer"
          onClick={() => navigate("/board")}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          pl={2}
        >
          <Text fontSize="2xl" fontWeight="medium">
            자유게시판
          </Text>
        </Box>

        <Heading as="h1" size="xl" textAlign="left" pb={2} mt={100} borderBottom="1px solid gray" mb={30}>
          {board.title}
        </Heading>

        <Flex textAlign="left" fontSize="lg" fontWeight="light" borderBottom="1px solid gray" pb={4}>
          <Text pr={4}>{board.nickname}</Text>
          <Spacer /> {/* Spacer로 왼쪽 오른쪽 나누기 */}
          <Text px={4}>{board.createdDate?.split("T")[0]}</Text>
          <Text px={4}>
            <Icon as={FaRegEye} mr={1} />
            {(board.views / 2).toFixed(0)}
          </Text>
          <Text px={4}>
            <Icon as={FaRegComment} mr={1} />
            {board.commentCount ?? 0}
          </Text>
        </Flex>

        <Box mt={50} borderBottom="1px solid gray">
          <Text fontSize="md" whiteSpace="pre-wrap" textAlign="left" pb={4} mt={100} mb={200}>
            <Box mt={6}>
              <Viewer initialValue={board.content} />
            </Box>
          </Text>
        </Box>

        {/*<Text*/}
        {/*  fontSize="md"*/}
        {/*  textAlign="left"*/}
        {/*  mt={6}*/}
        {/*  mb={6}*/}
        {/*  display="inline-block"*/}
        {/*  cursor="pointer"*/}
        {/*  onClick={() => navigate("/board")}*/}
        {/*>*/}
        {/*  목록*/}
        {/*</Text>*/}

        {/* 수정 버튼 조건부 표시 */}

        {/*<HStack mt={4} spacing={1} borderBottom="2px solid gray" pb={4}>*/}
        {/*  <Icon as={FaRegComment} boxSize={5} color={grayText} />*/}
        {/*  <Text fontSize="lg" color={grayText}>*/}
        {/*    댓글*/}
        {/*  </Text>*/}
        {/*  <Text fontSize="lg" color={blueText}>*/}
        {/*    {board.commentCount ?? 0}*/}
        {/*  </Text>*/}
        {/*</HStack>*/}
        <Box mt={5} mb={5}>
          <HStack>
            <Flex justify="space-between" mb={2} align="center">
              <Button bg="black" color="white" size="sm" ml={2} onClick={() => navigate("/board")}>
                목록
              </Button>
            </Flex>
            <Spacer />
            <Flex justify="space-between" mb={2} align="center">
              {String(loginMemberId) === String(board.memberId) && (
                <Button bg="blue" color="white" size="sm" ml={2} onClick={() => navigate(`/board/update/${board.id}`)}>
                  수정
                </Button>
              )}

              {user?.roleName === "ADMIN" && (
                <Button bg="red" color="white" size="sm" ml={2} onClick={handleDelete}>
                  삭제
                </Button>
              )}
            </Flex>
          </HStack>
        </Box>

        <Box borderTop="1px solid gray">
          <CommentList key={commentKey} type="boards" id={id} />
          <BoardCommentForm boardId={id} commentCount={board.commentCount || 0} onSuccess={handleCommentSuccess} />
        </Box>

        <Box mt={50}>
          <BoardList currentId={id} />
        </Box>
      </Box>
    </Box>
  );
};

export default BoardDetail;
