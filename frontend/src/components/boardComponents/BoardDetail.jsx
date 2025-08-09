import React, { useEffect, useState } from "react";
import { Box, Text, Heading, Flex, Spacer, Spinner, Button, useToast, HStack, Icon } from "@chakra-ui/react";
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

  const fetchBoard = async () => {
    try {
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

  const handleLike = async () => {
    try {
      await axios.post(`/api/board/${id}/like`, {}, { withCredentials: true });
      alert("추천되었습니다!");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("이미 추천한 게시글입니다!");
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.includes("이미 추천한 게시글입니다")
      ) {
        alert("이미 추천한 게시글입니다!");
      } else {
        alert("오류가 발생했습니다.");
      }
    }
  };

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
          <Viewer key={id} initialValue={board.content || ""} />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Button bg="black" color="white" size="sm" onClick={handleLike} mr={3}>
            추천
          </Button>
          <Text fontSize="md" color="gray.500">
            추천 수 : {board.likeCount || 0}
          </Text>
        </Box>

        {/* 댓글 */}
        <CommentList key={commentKey} type="boards" id={id} borderTop="1px solid gray" />
        <BoardCommentForm boardId={id} commentCount={board.commentCount || 0} onSuccess={handleCommentSuccess} />

        <HStack mt={5}>
          <Button bg="black" color="white" size="sm" onClick={() => navigate("/board")}>
            목록
          </Button>
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
