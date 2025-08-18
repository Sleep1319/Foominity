import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Box, Button, Heading, HStack, Input, Text, Code, Stack, Badge, useToast, Container } from "@chakra-ui/react";
import { useSpotifyPlayer } from "../../../quiz/playback/useSpotifyPlayer.js";

axios.defaults.withCredentials = true;

const API = "/api";
const TOTAL_ROUNDS = 10;
const QUIZ_QUERY = "k-pop";

export default function QuizPage() {
  const toast = useToast();
  const { device, product, connecting, error, connect, playTrackUri, pause } = useSpotifyPlayer();

  // ===== state =====
  const [round, setRound] = useState(null); // { roundId, trackUri, durationSeconds, hintAfterSeconds, reveal? }
  const [timeLeft, setTimeLeft] = useState(0);
  const [hint, setHint] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | playing | revealed | done

  // ===== refs (레이스/중복 방지 & 최신값 보관) =====
  const tickRef = useRef(null);
  const hintTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const busyRef = useRef(false); // 라운드 시작 중
  const submittingRef = useRef(false); // 정답 제출 중
  const nextingRef = useRef(false); // 다음 문제 이동 중
  const hintLoadingRef = useRef(false);
  const roundRef = useRef(null);
  const phaseRef = useRef("idle");

  useEffect(() => {
    roundRef.current = round;
  }, [round]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const connectLabel = useMemo(() => {
    if (device) return "연결됨 ✅";
    if (connecting) return "연결 중...";
    return "Spotify 연결";
  }, [device, connecting]);

  const clearTimers = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    tickRef.current = null;
    hintTimerRef.current = null;
    finishTimerRef.current = null;
  };

  useEffect(() => () => clearTimers(), []);

  // ===== 힌트: 실패시 재시도 =====
  const fetchHintWithRetry = async (rid, tries = 0) => {
    if (phaseRef.current !== "playing" || roundRef.current?.roundId !== rid) return;
    try {
      const res = await axios.get(`${API}/quiz/${rid}/hint`);
      const data = res.data || {};
      const artist =
        data.artist || data.artistName || (Array.isArray(data.artists) && data.artists[0]?.name) || data.name;
      if (artist) setHint({ artist });
    } catch {
      if (tries < 5 && phaseRef.current === "playing" && roundRef.current?.roundId === rid) {
        setTimeout(() => fetchHintWithRetry(rid, tries + 1), 800);
      }
    }
  };

  // ===== 라운드 시작 =====
  const startRound = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      if (!device) {
        toast({ title: "먼저 Spotify 연결을 눌러주세요.", status: "warning" });
        return;
      }
      if (product && product !== "premium") {
        toast({ title: "Premium 계정에서만 브라우저 재생이 가능합니다.", status: "warning" });
        return;
      }

      clearTimers();
      setHint(null);
      setAnswer("");

      const { data } = await axios.post(`${API}/quiz/start?query=${encodeURIComponent(QUIZ_QUERY)}`);
      // { roundId, trackUri, durationSeconds, hintAfterSeconds }
      setRound(data);
      roundRef.current = data;
      setPhase("playing");
      phaseRef.current = "playing";

      // 재생
      await playTrackUri(data.trackUri);

      // 타이머
      const duration = data?.durationSeconds ?? 30;
      const hintAfter = data?.hintAfterSeconds ?? 15;
      const rid = data.roundId; // ★ 이 라운드의 id를 캡처!
      setTimeLeft(duration);

      // 진행바 tick
      tickRef.current = setInterval(() => {
        setTimeLeft((t) => Math.max(0, t - 1));
      }, 1000);

      // 힌트 예약
      hintTimerRef.current = setTimeout(() => {
        if (!hintLoadingRef.current) {
          hintLoadingRef.current = true;
          fetchHintWithRetry(rid, 0).finally(() => (hintLoadingRef.current = false));
        }
      }, hintAfter * 1000);

      // 타임아웃 예약(조금 일찍)
      finishTimerRef.current = setTimeout(() => {
        if (phaseRef.current === "playing" && roundRef.current?.roundId === rid) {
          // ★ 타임아웃 제출은 반드시 '그 라운드의 rid'로 보낸다
          handleSubmit("", { silentIfStale: true, fromTimeout: true }, rid);
        }
      }, Math.max(0, duration * 1000 - 250));
    } catch (e) {
      toast({ title: "라운드 시작 실패", description: String(e?.message || e), status: "error" });
    } finally {
      busyRef.current = false;
    }
  };

  // ===== 정답 제출 / 패스 / 타임아웃 공용 처리 =====
  //    ridOverride: 특정 라운드 id로 제출(타임아웃 시 사용)
  const handleSubmit = async (
    value = answer,
    opts = { silentIfStale: false, fromTimeout: false },
    ridOverride = null
  ) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    // 타이머 정지
    clearTimers();

    // ★ 항상 최신 roundRef에서 읽되, 타임아웃인 경우 ridOverride를 우선
    const targetRid = ridOverride ?? roundRef.current?.roundId;
    if (!targetRid) {
      submittingRef.current = false;
      return;
    }

    try {
      // 1) 재생 중지(실패 무시)
      try {
        await pause();
      } catch {
        /* ignore */
      }

      // 2) 서버 제출
      const { data } = await axios.post(
        `${API}/quiz/${targetRid}/answer`,
        { answer: value ?? "" },
        { headers: { "Content-Type": "application/json" } }
      );

      // 이미 화면이 다른 라운드로 넘어갔다면 결과 무시
      if (roundRef.current?.roundId !== targetRid) {
        submittingRef.current = false;
        return;
      }

      if (data.correct) setScore((s) => s + 1);
      setRound((r) => (r ? { ...r, reveal: data } : r));
      setPhase("revealed");
      phaseRef.current = "revealed";
    } catch (e) {
      // stale(지난 라운드) 요청이면 조용히 무시
      const stale = roundRef.current?.roundId !== targetRid;
      if (!(stale && opts?.silentIfStale)) {
        // 진짜 실패(현재 라운드인데 400 등)이면 간단히 알림만
        toast({ title: "정답 처리 실패", description: String(e?.message || e), status: "error" });
      }
    } finally {
      submittingRef.current = false;
    }
  };

  const pass = () => handleSubmit("");

  // ===== 다음 문제 / 게임 시작 =====
  const next = async () => {
    if (nextingRef.current) return;
    nextingRef.current = true;
    try {
      const nextIdx = qIndex + 1;
      if (nextIdx >= TOTAL_ROUNDS) {
        setPhase("done");
        phaseRef.current = "done";
        return;
      }
      setQIndex((i) => i + 1); // 안전 +1
      await startRound();
    } finally {
      nextingRef.current = false;
    }
  };

  const startGame = async () => {
    if (busyRef.current) return;
    setScore(0);
    setQIndex(0);
    setPhase("idle");
    phaseRef.current = "idle";
    await startRound();
  };

  const percent = (() => {
    const total = round?.durationSeconds ?? 30;
    return round && phase === "playing" ? Math.min(100, ((total - timeLeft) / total) * 100) : 0;
  })();

  return (
    <Box as="main" pt="80px">
      <Container maxW="container.md">
        <Heading size="lg" mb={4}>
          노래 맞추기
        </Heading>

        <HStack mb={4}>
          <Button onClick={connect} isDisabled={!!device || connecting}>
            {connectLabel}
          </Button>
          {product && product !== "premium" && <Badge colorScheme="orange">현재 계정: {product}</Badge>}
        </HStack>

        <HStack gap={3} mb={4} align="center">
          {phase === "idle" && (
            <Button colorScheme="blue" onClick={startGame} isDisabled={!device || busyRef.current}>
              퀴즈 시작
            </Button>
          )}
          {phase === "revealed" && (
            <Button colorScheme="blue" onClick={next} isDisabled={nextingRef.current || busyRef.current}>
              다음 문제
            </Button>
          )}
          {phase === "done" && (
            <Button colorScheme="green" onClick={startGame} isDisabled={busyRef.current}>
              다시 시작
            </Button>
          )}
          <Badge fontSize={18}>점수: {score}</Badge>
        </HStack>

        {phase === "playing" && (
          <Stack spacing={3}>
            <HStack>
              <Badge fontSize={15}>
                문제 {qIndex + 1} / {TOTAL_ROUNDS}
              </Badge>
              <Badge fontSize={15} colorScheme={timeLeft <= 5 ? "red" : "gray"}>
                남은 시간: {timeLeft}초
              </Badge>
              {hint?.artist && <Badge fontSize={15}>가수 힌트: {hint.artist}</Badge>}
            </HStack>

            <Box w="100%" bg="gray.200" borderRadius="md" h="10px">
              <Box w={`${percent}%`} h="10px" borderRadius="md" bg="teal.400" />
            </Box>

            <HStack>
              <Input
                value={answer}
                placeholder="정답 (제목)"
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <Button
                colorScheme="blue"
                onClick={() => handleSubmit()}
                isDisabled={!answer.trim() || submittingRef.current}
              >
                정답 제출
              </Button>
              <Button variant="outline" onClick={pass} isDisabled={submittingRef.current}>
                패스
              </Button>
            </HStack>
          </Stack>
        )}

        {phase === "revealed" && round?.reveal && (
          <Box mt={4} p={4} bg="gray.50" borderRadius="md">
            <Text mb={2}>{round.reveal.correct ? "정답!" : round.reveal.timeout ? "⏰ 시간초과!" : "❌ 오답!"}</Text>
            <Code display="block" whiteSpace="pre-wrap">
              정답: {round.reveal.correctTitle}
              {"\n"}
              가수: {round.reveal.correctArtist}
            </Code>
          </Box>
        )}

        {phase === "done" && (
          <Box mt={6} p={4} bg="gray.50" borderRadius="md">
            <Heading size="md" mb={2}>
              퀴즈 완료
            </Heading>
            <Text>
              최종 점수: <b>{score}</b> / {TOTAL_ROUNDS}
            </Text>
          </Box>
        )}

        {error && (
          <Text mt={4} color="red.500">
            오류: {String(error.message || error)}
          </Text>
        )}
      </Container>
    </Box>
  );
}
