import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text, Stack, Divider } from "@chakra-ui/react";

const CommentList = ({ type, id }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      console.log(type + "의" + 1 + "번호인 리뷰 요청");
      const res = await axios.get(`/api/${type}/${id}/comments`);
      setComments(Array.isArray(res.data) ? res.data : []);
      console.log(res.data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (type && id) fetchComments();
  }, [type, id]);
  return (
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        댓글 {comments.length}개
      </Text>

      {comments.length === 0 ? (
        <Text color="gray.500">댓글이 없습니다.</Text>
      ) : (
        <Stack spacing={4}>
          {comments.map((comment) => (
            <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="semibold">{comment.nickname}</Text>
              <Divider my={2} />
              <Text whiteSpace="pre-line">{comment.comment}</Text>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommentList;
