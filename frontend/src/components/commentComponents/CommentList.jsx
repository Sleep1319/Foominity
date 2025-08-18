import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Stack,
  Divider,
  HStack,
  Avatar,
  Button,
  Spinner,
  Link as ChakraLink,
  useToast,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import RatingSummaryStar from "../ui/RatingSummaryStar";
import { useUser } from "@/redux/useUser.js";

const API_HOST = "http://localhost:8084";

const CommentList = ({ type = "reviews", id }) => {
  const toast = useToast();
  const { state } = useUser();
  const myId = state?.id ?? state?.memberId ?? state?.userId ?? state?.user?.id ?? null;
  const isAdmin = state?.roleName === "ADMIN";

  const [comments, setComments] = useState([]);
  const [avatarMap, setAvatarMap] = useState({});
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // 삭제/수정 상태
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editStar, setEditStar] = useState(0);
  const [savingEdit, setSavingEdit] = useState(false);

  // ✅ 무한 스크롤(프론트만): 보이는 개수/센티널/스크롤 박스
  const [visibleCount, setVisibleCount] = useState(10); // 처음 10개
  const step = 8; // 추가 로드 단위
  const scrollBoxRef = useRef(null);
  const sentinelRef = useRef(null);

  const reviewId = id;

  const getUserId = (c) => {
    const uid = c?.memberId ?? c?.member_id ?? c?.userId ?? c?.member?.id ?? c?.user?.id ?? null;
    return uid != null ? String(uid) : null;
  };

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
      // 현재 컨트롤러는 리뷰 댓글만 있으므로 reviews 고정
      const res = await axios.get(`/api/reviews/${id}/comments`);
      const arr = Array.isArray(res.data) ? res.data : [];
      setComments(arr);
      setVisibleCount(10); // 목록 바뀌면 초기화
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
      setComments([]);
      setVisibleCount(10);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  // ✅ 보이는 항목만 아바타 로드 (네트워크 절약)
  useEffect(() => {
    const loadAvatars = async () => {
      const visible = comments.slice(0, visibleCount);
      const ids = [...new Set(visible.map(getUserId).filter(Boolean))];
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

        const map = { ...avatarMap };
        for (const { userId, data } of results) {
          const raw = data?.profileImage?.imagePath ?? data?.imageUrl ?? data?.avatar ?? null;
          if (raw) {
            map[String(userId)] = raw.startsWith("http") ? raw : `${API_HOST}${raw.startsWith("/") ? "" : "/"}${raw}`;
          }
        }
        setAvatarMap(map);
      } catch (e) {
        console.error("아바타 로딩 실패:", e);
      }
    };

    loadAvatars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, visibleCount]);

  // ✅ 센티널로 보이는 개수 늘리기
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((v) => Math.min(v + step, comments.length));
        }
      },
      { root: scrollBoxRef.current, rootMargin: "100px 0px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [comments.length]);

  const canManage = (comment) => {
    const ownerId = getUserId(comment);
    if (!ownerId) return false;
    if (isAdmin) return true;
    if (!myId) return false;
    return String(ownerId) === String(myId);
  };

  // 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    try {
      setDeletingId(commentId);
      await axios.delete(`/api/comments/${commentId}`, { withCredentials: true });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error("댓글 삭제 실패:", e);
      const msg =
        e?.response?.status === 403
          ? "본인 댓글만 삭제할 수 있습니다."
          : e?.response?.status === 401
          ? "로그인이 필요합니다."
          : "삭제 중 오류가 발생했습니다.";
      toast({ status: "error", description: msg });
    } finally {
      setDeletingId(null);
    }
  };

  // 수정
  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content ?? comment.comment ?? "");
    setEditStar(Number(comment.starPoint) || 0);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setEditStar(0);
  };
  const saveEdit = async () => {
    const body = {
      comment: (editContent ?? "").trim(),
      starPoint: Number(editStar) || 0,
    };
    if (!body.comment) return toast({ status: "warning", description: "내용을 입력해주세요." });
    if (body.starPoint < 0 || body.starPoint > 5)
      return toast({ status: "warning", description: "별점은 0~5 사이여야 합니다." });

    try {
      setSavingEdit(true);
      await axios.put(`/api/comments/${editingId}`, body, { withCredentials: true });
      setComments((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, content: body.comment, comment: body.comment, starPoint: body.starPoint } : c
        )
      );
      cancelEdit();
      toast({ status: "success", description: "수정되었습니다." });
    } catch (e) {
      console.error("댓글 수정 실패:", e);
      const msg =
        e?.response?.status === 403
          ? "본인 댓글만 수정할 수 있습니다."
          : e?.response?.status === 401
          ? "로그인이 필요합니다."
          : "수정 중 오류가 발생했습니다.";
      toast({ status: "error", description: msg });
    } finally {
      setSavingEdit(false);
    }
  };

  // ✅ 보이는 리스트만 그리기
  const list = comments.slice(0, visibleCount);
  const canLoadMore = visibleCount < comments.length;

  return (
    <Box mt={8}>
      {comments.length === 0 ? (
        <Text color="gray.500">댓글이 없습니다.</Text>
      ) : (
        <Stack spacing={4}>
          {/* 요약 박스 */}
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

          {/* ✅ 박스 내부 스크롤 + 센티널 */}
          <Box
            ref={scrollBoxRef}
            maxH="420px"
            overflowY="auto"
            borderWidth="1px"
            rounded="lg"
            p={2}
            sx={{ overscrollBehavior: "contain" }}
          >
            <Stack spacing={4}>
              {list.map((comment) => {
                const userId = getUserId(comment);
                const avatarSrc = (userId && avatarMap[String(userId)]) || "/src/assets/images/defaultProfile.jpg";
                const isEditing = editingId === comment.id;

                return (
                  <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md">
                    <HStack spacing={3} align="center" justify="space-between">
                      <HStack spacing={3} align="center">
                        {userId ? (
                          <ChakraLink
                            as={RouterLink}
                            to={`/users/${userId}/profile`}
                            display="inline-flex"
                            alignItems="center"
                            gap="12px"
                            _hover={{ textDecoration: "none" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Avatar size="sm" src={avatarSrc} />
                            <Text fontWeight="semibold" _hover={{ textDecoration: "underline" }}>
                              {comment.nickname}
                            </Text>
                          </ChakraLink>
                        ) : (
                          <>
                            <Avatar size="sm" src={avatarSrc} />
                            <Text fontWeight="semibold">{comment.nickname}</Text>
                          </>
                        )}

                        {!isEditing ? (
                          <RatingSummaryStar value={Number(comment.starPoint) || 0} />
                        ) : (
                          <HStack>
                            <Text fontSize="sm">별점</Text>
                            <NumberInput
                              size="sm"
                              step={0.5}
                              min={0}
                              max={5}
                              value={editStar}
                              onChange={(_, n) => setEditStar(isNaN(n) ? 0 : n)}
                              width="80px"
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </HStack>
                        )}
                      </HStack>

                      {(isAdmin || canManage(comment)) && (
                        <HStack>
                          {!isEditing ? (
                            <>
                              <Button size="xs" variant="outline" onClick={() => startEdit(comment)}>
                                수정
                              </Button>
                              <Button
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(comment.id)}
                                isLoading={deletingId === comment.id}
                              >
                                삭제
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="xs" colorScheme="blue" onClick={saveEdit} isLoading={savingEdit}>
                                저장
                              </Button>
                              <Button size="xs" variant="ghost" onClick={cancelEdit} disabled={savingEdit}>
                                취소
                              </Button>
                            </>
                          )}
                        </HStack>
                      )}
                    </HStack>

                    <Divider my={2} />

                    {!isEditing ? (
                      <Text whiteSpace="pre-line">{comment.content ?? comment.comment ?? ""}</Text>
                    ) : (
                      <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} minH="100px" />
                    )}
                  </Box>
                );
              })}

              {/* 센티널 */}
              <Box ref={sentinelRef} h="1px" />

              {/* 버튼 fallback */}
              {canLoadMore && (
                <Box textAlign="center" mt={1}>
                  <Button size="xs" onClick={() => setVisibleCount((v) => Math.min(v + step, comments.length))}>
                    더 보기
                  </Button>
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default CommentList;
