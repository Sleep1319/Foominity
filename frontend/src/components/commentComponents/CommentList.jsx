import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text, Stack, Divider, HStack, Avatar, Button, Spinner } from "@chakra-ui/react";
import RatingSummaryStar from "../ui/RatingSummaryStar";

const CommentList = ({ type, id }) => {
  const [comments, setComments] = useState([]);
  const [avatarMap, setAvatarMap] = useState({});
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const reviewId = id;

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await axios.get(`/api/reviews/${reviewId}/comments/summary` /*, { withCredentials: true }*/);
      setSummary(res.data);
    } catch (e) {
      console.error("요약 불러오기 실패:", e);
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/${type}/${id}/comments`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (type && id) fetchComments();
  }, [type, id]);

  useEffect(() => {
    const loadAvatars = async () => {
      const ids = [...new Set(comments.map((c) => c.memberId).filter(Boolean))];
      if (ids.length === 0) return;

      try {
        const results = await Promise.all(
          ids.map((memberId) =>
            axios
              .get(`/api/users/${memberId}/profile`)
              .then((r) => ({ memberId, data: r.data }))
              .catch(() => ({ memberId, data: null }))
          )
        );
        const map = {};
        for (const { memberId, data } of results) {
          const path = data?.profileImage?.imagePath ?? data?.imageUrl ?? data?.avatar ?? null;
          if (path) map[memberId] = path;
        }
        setAvatarMap(map);
      } catch (e) {
        console.error("아바타 로딩 실패:", e);
      }
    };
    loadAvatars();
  }, [comments]);

  return (
    <Box mt={8}>
      {comments.length === 0 ? (
        <Text color="gray.500">댓글이 없습니다.</Text>
      ) : (
        <Stack spacing={4}>
          {/* ✅ 요약 박스를 리스트 위에 위치시킴 */}
          <Box mb={2} p={4} borderWidth="1px" borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">댓글 감성 요약</Text>
              <Button size="sm" onClick={fetchSummary} isLoading={loadingSummary}>
                요약 보기
              </Button>
            </HStack>

            {loadingSummary ? (
              <HStack>
                <Spinner size="sm" />
                <Text>분석 중...</Text>
              </HStack>
            ) : summary ? (
              <>
                {console.log("댓글 감성 요약 데이터:", summary)}
                <Stack spacing={2}>
                  <Box>
                    <Text fontWeight="semibold">긍정</Text>
                    <Text whiteSpace="pre-wrap" color="gray.700">
                      {summary.positive}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold">부정</Text>
                    <Text whiteSpace="pre-wrap" color="gray.700">
                      {summary.negative}
                    </Text>
                  </Box>
                </Stack>
              </>
            ) : (
              <Text color="gray.500">요약이 없습니다. 버튼을 눌러 생성하세요.</Text>
            )}
          </Box>

          {/* 댓글 목록 */}
          {comments.map((comment) => (
            <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md">
              <HStack spacing={3} align="center">
                <Avatar
                  size="sm"
                  src={
                    avatarMap[comment.memberId]
                      ? `http://localhost:8084${avatarMap[comment.memberId]}`
                      : "/src/assets/images/defaultProfile.jpg"
                  }
                />
                <Text fontWeight="semibold">{comment.nickname}</Text>
                <RatingSummaryStar value={Number(comment.starPoint) || 0} />
              </HStack>
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
