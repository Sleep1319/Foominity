import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text, Stack, Divider, HStack, Avatar, Button, Spinner } from "@chakra-ui/react";
import RatingSummaryStar from "../ui/RatingSummaryStar";
import { Link as RouterLink } from "react-router-dom";

const API_HOST = "http://localhost:8084";

const CommentList = ({ type, id }) => {
  const [comments, setComments] = useState([]);
  const [avatarMap, setAvatarMap] = useState({});
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const reviewId = id;

  // 댓글 객체에서 유저ID를 추출 (백엔드 필드명 변동 대응)
  const getUserId = (c) =>
    c?.memberId ??
    c?.userId ??
    c?.authorId ??
    c?.writerId ??
    c?.member?.id ??
    c?.user?.id ??
    // 마지막 최후의 수단으로 comment.id를 사용해야 한다면 여기에 둡니다.
    c?.id ??
    null;

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await axios.get(`/api/reviews/${reviewId}/comments/summary`);
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
      const ids = [...new Set(comments.map(getUserId).filter(Boolean))];
      if (ids.length === 0) return;

      try {
        const results = await Promise.all(
          ids.map((userId) =>
            axios
              .get(`/api/users/${userId}/profile`)
              .then((r) => ({ userId, data: r.data }))
              .catch(() => ({ userId, data: null }))
          )
        );

        const map = {};
        for (const { userId, data } of results) {
          const raw = data?.profileImage?.imagePath ?? data?.imageUrl ?? data?.avatar ?? null;

          if (raw) {
            // 상대경로면 백엔드 호스트 붙여 절대경로로 저장
            const abs = raw.startsWith("http") ? raw : `${API_HOST}${raw.startsWith("/") ? "" : "/"}${raw}`;
            map[userId] = abs;
          }
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
          {/* ✅ 요약 박스 */}
          <Box mb={2} p={4} borderWidth="1px" borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">앨범 평가 한 눈에 보기</Text>
              <Button size="sm" onClick={fetchSummary} isLoading={loadingSummary}>
                요약 보기
              </Button>
            </HStack>

            {loadingSummary ? (
              <HStack>
                <Spinner size="sm" />
                <Text>분석 중…</Text>
              </HStack>
            ) : summary ? (
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
            ) : (
              <Text color="gray.500"> 앨범평가를 한 눈에 보려면 버튼을 눌러 생성하세요.</Text>
            )}
          </Box>

          {/* ✅ 댓글 목록 */}
          {comments.map((comment, idx) => {
            const userId = getUserId(comment);
            const profileUrl = userId ? `/users/${userId}/profile` : null;
            const avatarSrc = (userId && avatarMap[userId]) || "/src/assets/images/defaultProfile.jpg";

            // 디버깅 로그 (렌더 시 콘솔에 출력)
            // 필요 없으면 제거하세요
            // eslint-disable-next-line no-console
            console.log(`[row ${idx}] userId=`, userId, "comment:", comment);

            return (
              <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md">
                <HStack spacing={3} align="center">
                  {profileUrl ? (
                    <HStack
                      as={RouterLink}
                      to={profileUrl}
                      spacing={3}
                      align="center"
                      cursor="pointer"
                      _hover={{ textDecoration: "none" }}
                      title="프로필로 이동"
                    >
                      <Avatar size="sm" src={avatarSrc} />
                      <Text fontWeight="semibold" _hover={{ textDecoration: "underline" }}>
                        {comment.nickname}
                      </Text>
                    </HStack>
                  ) : (
                    <>
                      <Avatar size="sm" src={avatarSrc} />
                      <Text fontWeight="semibold">{comment.nickname}</Text>
                    </>
                  )}

                  <RatingSummaryStar value={Number(comment.starPoint) || 0} />
                </HStack>

                <Divider my={2} />
                <Text whiteSpace="pre-line">{comment.comment}</Text>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default CommentList;
