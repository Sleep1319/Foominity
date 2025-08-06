// src/view/board/BoardDetail.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Flex,
  Spacer,
  Spinner,
  Button,
  useToast,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegComment } from "react-icons/fa";
import { useUser} from "@/redux/useUser.js";
import axios from "axios";
import BoardCommentForm from "@/components/commentComponents/BoardCommentForm.jsx";
// import CommentList from "@/components/commentComponents/CommenList.jsx";
import BoardList from "./BoardList";
import { Viewer } from "@toast-ui/react-editor";
import CommentList from "../commentComponents/CommentList";

const BoardDetail = () => {
  const { state: user } = useUser();
  const loginMemberId = user?.memberId;
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentKey, setCommentKey] = useState(0);

  const grayText = useColorModeValue("gray.700", "white");
  const blueText = useColorModeValue("blue.400", "blue.200");

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

  useEffect(() => {
    fetchBoard();
    window.scrollTo(0, 0);
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/board/delete/${id}`, { withCredentials: true });
      toast({ title: "게시글이 삭제되었습니다.", status: "info", duration: 1500 });
      navigate("/board");
    } catch {
      toast({ title: "삭제 실패", status: "error", duration: 1500 });
    }
  };

  const handleCommentSuccess = () => setCommentKey((k) => k + 1);

  if (loading) {
    return (
      <Box minH="60vh" display="flex" align="center" justify="center">
        <Spinner size="xl" />
      </Box>
    );
  }
  if (!board) {
    return (
      <Box minH="60vh" display="flex" align="center" justify="center">
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

        <Heading as="h1" size="2xl" textAlign="left" pb={2} mt={100} borderBottom="1px solid gray" mb={30}>
          {board.title}
        </Heading>

        <Flex textAlign="left" fontSize="lg" fontWeight="light" borderBottom="1px solid gray" pb={4}>
          <Text pr={4}>{board.nickname}</Text>
          <Spacer />
          <Text px={4}>{board.createdDate?.split("T")[0]}</Text>
          <Text px={4}>
            <Icon as={FaRegEye} mr={1} />
            {(board.views / 2).toFixed(0)}
          </Text>
          <Text px={4}>
            <Icon as={FaRegComment} mr={1} />
            {board.commentCount || 0}
          </Text>
        </Flex>

        {/* 내용 */}
        <Box mt={25} mb={150} pb={4}>
          <Viewer initialValue={board.content} />
        </Box>

        {/* 댓글 */}
        <CommentList key={commentKey} type="boards" id={id} borderTop="1px solid gray" />
        <BoardCommentForm boardId={id} commentCount={board.commentCount || 0} onSuccess={handleCommentSuccess} />

        {/* 버튼들 */}
        <HStack mt={5}>
          <Button bg="black" color="white" size="sm" onClick={() => navigate("/board")}>
            목록
          </Button>
          {/* ★ 신고하기: 별도 페이지로 이동 ★ */}
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => navigate(`/report/create?targetType=BOARD&targetId=${board.id}`)}
          >
            신고하기
          </Button>
          <Spacer />
          {String(loginMemberId) === String(board.memberId) && (
            <Button bg="blue" color="white" size="sm" onClick={() => navigate(`/board/update/${board.id}`)}>
              수정
            </Button>
          )}
          {user?.roleName === "ADMIN" && (
            <Button bg="red" color="white" size="sm" onClick={handleDelete}>
              삭제
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default BoardDetail;
