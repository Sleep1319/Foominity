import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Avatar,
  Text,
  Spinner,
  Button,
  SimpleGrid,
  Badge,
  Image,
} from "@chakra-ui/react";
import { ArrowRightIcon, ArrowBackIcon, RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useUser } from "@/redux/useUser.js";

const menuItems = [
  { label: "1. 플레이리스트 추천", key: "recommend" },
  { label: "2. 유사곡 추천", key: "similar" },
  { label: "3. 가사 번역", key: "translate" },
];

/* ------------------ 유틸 ------------------ */

// 가사 포맷팅
function prettifyLyrics(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/([.!?])(\s+|$)/g, "$1\n"))
    .join("\n")
    .replace(/\n{2,}/g, "\n\n");
}

// 추천 텍스트 → 카드 아이템 파싱(유연: JSON/한 줄 리스트/빈줄 리스트)
function parseRecommendationCards(replyText) {
  // 1) JSON 우선
  try {
    const j = JSON.parse(replyText);
    if (Array.isArray(j)) {
      return j
        .map((o, idx) => ({
          idx: idx + 1,
          title: o.title || o.track || o.name || "",
          artist: o.artist || o.singer || "",
          reason: o.reason || o.note || "",
          previewUrl: o.previewUrl || "",
          artworkUrl100: o.artworkUrl100 || "",
        }))
        .filter((x) => x.title && x.artist);
    }
  } catch (e) {
    /* ignore non-JSON */
  }

  // 2) 번호가 붙은 "한 줄 리스트" 패턴
  // 예: "1. Title - Artist  이유: ~~~"
  const lineRe =
    /^\s*\d+\s*(?:[)\.\-:])?\s*(.+?)\s*(?:-|–|—)\s*(.+?)(?:\s*(?:\||-|—)?\s*(?:이유|reason)[:：]\s*(.+))?\s*$/gmi;
  const oneLineItems = [];
  let m;
  let idx = 1;
  const seen = new Set();
  while ((m = lineRe.exec(replyText)) !== null) {
    const title = (m[1] || "").trim();
    const artist = (m[2] || "").trim();
    const reason = (m[3] || "").trim();
    const key = `${title}__${artist}`;
    if (title && artist && !seen.has(key)) {
      oneLineItems.push({ idx: idx++, title, artist, reason });
      seen.add(key);
    }
  }
  if (oneLineItems.length) return oneLineItems;

  // 3) 빈 줄로 나뉜 블록 형태
  const blocks = String(replyText || "")
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const items = [];
  idx = 1;
  for (const b of blocks) {
    const lines = b.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    const first = lines[0].replace(/^\s*\d+\s*(?:[)\.\-:]+)?\s*/, "");
    const pair = first.split(/\s*(?:-|–|—)\s*/);
    if (pair.length < 2) continue;
    const title = pair[0].trim();
    const artist = pair.slice(1).join(" - ").trim();

    const rest = lines.slice(1).join(" ").trim();
    const reason = rest.replace(/^(이유|reason)[:：]\s*/i, "");

    if (title && artist) items.push({ idx: idx++, title, artist, reason });
  }
  return items;
}

/* ---- iTunes 메타 데이터 보강: previewUrl / artworkUrl100 ---- */

/* ---- iTunes 메타 데이터 보강: previewUrl / artworkUrl100 ---- */

const IT_COUNTRIES = ["US", "KR"];
const itunesCache = new Map();

/** 기본 정규화 */
function base(s) {
  return (s || "").normalize("NFKC").toLowerCase().trim();
}

/** 제목/아티스트에서 괄호/feat/버전/기호 제거 + 공백 정리 */
function stripDecor(s) {
  return base(s)
    // 괄호 안 정보 제거: (feat ...), (Remastered 2019), [From ...]
    .replace(/\s*(\(|\[).+?(\)|\])\s*/g, " ")
    // 끝쪽의 "- feat XXX", "- with XXX", "- Single", "- Live" 등 제거
    .replace(/\s*[-–—]\s*(feat\.?|featuring|with|x)\s+.+$/g, " ")
    .replace(/\s*[-–—]\s*(single|ep|version|edit|remaster(ed)?|live|from .+)$/g, " ")
    // & → and 통일
    .replace(/&/g, " and ")
    // 영숫자/공백만 남김
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const STOP = new Set(["the", "and", "a", "an", "x", "feat", "featuring", "with"]);

/** 토큰화(불용어 제거) */
function tokens(s) {
  return stripDecor(s)
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}
function tokensSet(s) {
  return new Set(tokens(s));
}
function overlapRatio(a, b) {
  const A = tokensSet(a);
  const B = tokensSet(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / Math.max(A.size, B.size);
}

/** 점수 계산: 제목/아티스트 겹침 + 정확 일치 가중치, 커버/카라오케 패널티 */
function computeScore(result, wantedTitle, wantedArtist) {
  const titleExact = stripDecor(result.trackName) === stripDecor(wantedTitle);
  const artistExact = stripDecor(result.artistName) === stripDecor(wantedArtist);
  const titleOv = overlapRatio(result.trackName, wantedTitle);
  const artistOv = overlapRatio(result.artistName, wantedArtist);

  let s = 0;
  // 제목 가중치
  s += titleExact ? 6 : Math.round(titleOv * 4);   // 최대 6점
  // 아티스트 가중치
  s += artistExact ? 6 : Math.round(artistOv * 6); // 최대 6점

  // 카라오케/커버/트리뷰트 등은 패널티
  const nameBlob = `${result.collectionName || ""} ${result.trackName || ""}`;
  if (/(karaoke|instrumental|tribute|cover)/i.test(nameBlob)) s -= 4;

  return { s, titleOv, artistOv, titleExact, artistExact };
}

/** iTunes 검색 (음악만, 트랙만) */
async function fetchItunes(term, country, extraParams = "") {
  const url =
    `https://itunes.apple.com/search?term=${encodeURIComponent(term)}` +
    `&media=music&entity=musicTrack&limit=50&country=${country}&lang=ko_kr${extraParams}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();
  return json.results || [];
}

/** 미리듣기/커버 메타 찾기: 아티스트 겹침 0.6 미만은 필터링(동명이곡 오매칭 방지) */
async function searchItunesTrackMeta(title, artist) {
  const cacheKey = `${stripDecor(title)}|${stripDecor(artist)}`;
  if (itunesCache.has(cacheKey)) return itunesCache.get(cacheKey);

  const MIN_ARTIST_OVERLAP = 0.6; // ← 핵심! 아티스트 겹침 하한
  const queries = [
    // 1) 제목+아티스트 통합 쿼리
    (country) => fetchItunes(`${title} ${artist}`, country, ""),
    // 2) 제목 중심
    (country) => fetchItunes(title, country, "&attribute=songTerm"),
  ];

  let best = null;
  let bestScore = -Infinity;

  for (const country of IT_COUNTRIES) {
    for (const q of queries) {
      let results = [];
      try {
        results = await q(country);
      } catch (e) {
        // ignore and move on
      }
      if (!results.length) continue;

      // 1차 필터: 아티스트 겹침 0.6 이상만 남김
      let candidates = results.filter(
        (r) => overlapRatio(r.artistName, artist) >= MIN_ARTIST_OVERLAP
      );

      // 그래도 하나도 없으면 살짝 완화(0.45) — 하지만 아예 겹침 0에 가까운 건 절대 허용 X
      if (!candidates.length) {
        candidates = results.filter(
          (r) => overlapRatio(r.artistName, artist) >= 0.45
        );
      }
      if (!candidates.length) continue;

      // 최고 점수 선택
      for (const r of candidates) {
        const { s } = computeScore(r, title, artist);
        if (s > bestScore) {
          bestScore = s;
          best = r;
        }
      }
    }
    // 국가 한 번에서 충분히 좋은 후보가 나오면 다른 국가는 보지 않아도 됨
    if (best) break;
  }

  const meta =
    best && bestScore > 0
      ? {
          previewUrl: best.previewUrl || "",
          artworkUrl100: best.artworkUrl100 || "",
        }
      : {};

  itunesCache.set(cacheKey, meta);
  return meta;
}

async function enrichWithItunesData(items) {
  const capped = items.slice(0, 10);
  const enriched = await Promise.all(
    capped.map(async (it) => {
      if (it.previewUrl && it.artworkUrl100) return it;
      const meta = await searchItunesTrackMeta(it.title, it.artist);
      return { ...it, ...meta };
    })
  );
  return enriched.concat(items.slice(10));
}

/* ------------------ 뷰 컴포넌트 ------------------ */

function RecommendationCards({ items }) {
  return (
    <Box w="100%" mt={1}>
      <SimpleGrid columns={[1, 1]} spacing={3}>
        {items.map((it) => (
          <HStack
            key={`${it.idx}-${it.title}-${it.artist}`}
            align="stretch"
            borderWidth="1px"
            borderRadius="lg"
            p={3}
            spacing={3}
            bg="white"
          >
            {it.artworkUrl100 ? (
              <Image
                src={it.artworkUrl100}
                alt={it.title}
                boxSize="56px"
                borderRadius="md"
                flexShrink={0}
              />
            ) : (
              <Box
                boxSize="56px"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text fontSize="lg">🎵</Text>
              </Box>
            )}

            <Box flex="1">
              <HStack justify="space-between" mb={1}>
                <Badge colorScheme="gray">{it.idx}</Badge>
              </HStack>
              <Text fontWeight="semibold">{it.title}</Text>
              <Text fontSize="sm" color="gray.600">
                {it.artist}
              </Text>
              {it.reason && (
                <Text mt={1} fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                  {it.reason}
                </Text>
              )}
              {it.previewUrl && (
                <Box mt={2}>
                  <audio controls src={it.previewUrl} style={{ width: "100%" }} />
                </Box>
              )}
            </Box>
          </HStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}

// 선택한 시드곡 카드 (미리듣기 1줄 포함)
function SeedTrackCard({ meta }) {
  if (!meta) return null;
  const { title, artist, artworkUrl100, previewUrl } = meta;
  return (
    <HStack
      align="stretch"
      borderWidth="1px"
      borderRadius="lg"
      p={3}
      spacing={3}
      bg="white"
      maxW="70%"
    >
      {artworkUrl100 ? (
        <Image src={artworkUrl100} alt={title} boxSize="56px" borderRadius="md" />
      ) : (
        <Box
          boxSize="56px"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="lg">🎵</Text>
        </Box>
      )}
      <Box flex="1">
        <Text fontWeight="semibold">{title}</Text>
        <Text fontSize="sm" color="gray.600">
          {artist}
        </Text>
        {previewUrl && (
          <Box mt={2}>
            <audio controls src={previewUrl} style={{ width: "100%" }} />
          </Box>
        )}
      </Box>
    </HStack>
  );
}

/* ------------------ 본체 ------------------ */

const GuidedChat = forwardRef(function GuidedChat({ onModeChange }, ref) {
  const initialBot = { sender: "BOT", content: "안녕하세요! 원하는 기능을 선택해주세요:" };

  const [messages, setMessages] = useState([initialBot]);
  const [mode, setMode] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useUser();

  // ✅ 스마트 오토스크롤
  const scrollRef = useRef(null);      // 대화 리스트 컨테이너
  const stickRef = useRef(true);       // 바닥 고정 여부
  const [showJump, setShowJump] = useState(false); // '맨 아래로' 버튼

  // 세션 가드
  const sessionRef = useRef(0);

  const scrollToBottom = (smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    if (smooth) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    else el.scrollTop = el.scrollHeight;
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 80;
    stickRef.current = nearBottom;
    setShowJump(!nearBottom);
  };

  const push = useCallback((msg) => {
    // 메시지 추가 직전에 '지금 바닥 근처인가' 계산
    const el = scrollRef.current;
    if (el) {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 80;
      stickRef.current = nearBottom;
    }
    setMessages((prev) => [...prev, msg]);
  }, []);

  const backToMenu = useCallback(() => {
    sessionRef.current += 1;
    setMode(null);
    onModeChange?.(null);
    setInput("");
    setLoading(false);
    push({ sender: "BOT", content: "원하는 기능을 다시 선택해주세요:" });
  }, [onModeChange, push]);

  const resetAll = useCallback(() => {
    sessionRef.current += 1;
    setMessages([initialBot]);
    setMode(null);
    onModeChange?.(null);
    setInput("");
    setLoading(false);
    // 초기화 시 맨 아래로
    setTimeout(() => {
      stickRef.current = true;
      scrollToBottom(false);
      setShowJump(false);
    }, 0);
  }, [onModeChange]);

  // 외부(오른쪽 패널)에서 전송할 수 있도록 메서드 노출
  useImperativeHandle(
    ref,
    () => ({
      push,
      // seedText: "제목 - 아티스트"
      // seedMeta: { title, artist, previewUrl?, artworkUrl100? }
      sendSimilar: async (seedText, seedMeta) => {
        setMode("similar");
        onModeChange?.("similar");

        const sid = sessionRef.current;

        if (seedMeta) {
          push({ sender: "BOT", type: "seed", meta: seedMeta });
        }
        push({ sender: "USER", content: seedText });

        setLoading(true);
        try {
          const { data } = await axios.post("/api/chat", {
            message: seedText,
            mode: "similar",
          });

          if (sid !== sessionRef.current) return;

          let cards = [];
          if (typeof data.reply === "string") {
            cards = parseRecommendationCards(data.reply);
          }

          if (cards.length > 0) {
            const enriched = await enrichWithItunesData(cards);
            if (sid === sessionRef.current) {
              push({ sender: "BOT", type: "cards", items: enriched });
            }
          } else {
            push({ sender: "BOT", content: data.reply });
          }
        } catch (e) {
          if (sid === sessionRef.current) {
            push({
              sender: "BOT",
              content: "죄송합니다. 유사곡 추천 중 오류가 발생했어요.",
            });
          }
        } finally {
          if (sid === sessionRef.current) {
            setLoading(false);
            setInput("");
          }
        }
      },
      resetAll,
      backToMenu,
    }),
    [push, onModeChange, resetAll, backToMenu]
  );

  const handleMenuClick = (item) => {
    push({ sender: "USER", content: item.label });
    setMode(item.key);
    onModeChange(item.key);

    const prompts = {
      recommend:
        "플레이리스트 추천을 선택하셨습니다. 오른쪽 화면에서 질문에 답해주세요!",
      similar:
        "오른쪽 패널에서 원곡을 검색해 선택하면 자동으로 전송됩니다. (또는 아래에 직접 '제목 - 아티스트' 입력)",
      translate: "번역할 가사를 입력해주세요.",
    };
    push({ sender: "BOT", content: prompts[item.key] });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const sid = sessionRef.current;
    push({ sender: "USER", content: input });
    setLoading(true);
    try {
      const { data } = await axios.post("/api/chat", {
        message: input,
        mode,
      });

      if (sid !== sessionRef.current) return;

      if (mode === "translate") {
        push({ sender: "BOT", content: prettifyLyrics(data.reply) });
      } else {
        const cards = parseRecommendationCards(String(data.reply || ""));
        if (cards.length > 0) {
          const enriched = await enrichWithItunesData(cards);
          if (sid === sessionRef.current) {
            push({ sender: "BOT", type: "cards", items: enriched });
          }
        } else {
          push({ sender: "BOT", content: data.reply });
        }
      }
    } catch (e) {
      if (sid === sessionRef.current) {
        push({ sender: "BOT", content: "죄송합니다. 오류가 발생했어요." });
      }
    } finally {
      if (sid === sessionRef.current) {
        setLoading(false);
        setInput("");
      }
    }
  };

  // 메시지 변경 시, 바닥에 있을 때만 자동 스크롤
  useEffect(() => {
    if (stickRef.current) {
      scrollToBottom(false);
    }
  }, [messages]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      h="600px"
      display="flex"
      flexDirection="column"
      position="relative"
      bg="gray.50"
    >
      {/* 상단 액션 버튼 */}
      <HStack justify="flex-end" mb={2}>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<ArrowBackIcon />}
          onClick={backToMenu}
          isDisabled={mode === null && messages.length === 1}
        >
          뒤로가기
        </Button>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<RepeatIcon />}
          onClick={resetAll}
          isDisabled={mode === null && messages.length === 1}
        >
          처음으로
        </Button>
      </HStack>

      {/* '맨 아래로' 버튼 */}
      {showJump && (
        <Button
          size="sm"
          position="absolute"
          right="12px"
          bottom="72px"
          onClick={() => {
            stickRef.current = true;
            scrollToBottom(true);
            setShowJump(false);
          }}
          boxShadow="md"
        >
          맨 아래로
        </Button>
      )}

      {/* 대화 내역 */}
      <VStack
        ref={scrollRef}
        onScroll={handleScroll}
        spacing={3}
        flexGrow={1}
        overflowY="auto"
        mb={4}
        align="stretch"
      >
        {messages.map((m, i) => {
          if (m.type === "cards" && m.sender === "BOT") {
            return (
              <HStack key={`cards-${i}`} justify="flex-start" align="flex-start">
                <Avatar
                  size="md"
                  name="DoremiSOL"
                  border="1px solid gray"
                  src="/src/assets/images/doremisolChatProfile.png"
                />
                <Box maxW="70%">
                  <RecommendationCards items={m.items} />
                </Box>
              </HStack>
            );
          }

          if (m.type === "seed" && m.sender === "BOT") {
            return (
              <HStack key={`seed-${i}`} justify="flex-start" align="flex-start">
                <Avatar
                  size="md"
                  name="DoremiSOL"
                  border="1px solid gray"
                  src="/src/assets/images/doremisolChatProfile.png"
                />
                <SeedTrackCard meta={m.meta} />
              </HStack>
            );
          }

          return (
            <HStack
              key={i}
              justify={m.sender === "USER" ? "flex-end" : "flex-start"}
              align="flex-start"
              spacing={3}
            >
              {m.sender === "BOT" && (
                <Avatar
                  size="md"
                  name="DoremiSOL"
                  border="1px solid gray"
                  src="/src/assets/images/doremisolChatProfile.png"
                />
              )}
              <Box
                bg={m.sender === "USER" ? "blue.100" : "gray.100"}
                p={3}
                borderRadius="md"
                maxW="70%"
              >
                <Text whiteSpace="pre-wrap">{m.content}</Text>
              </Box>
              {m.sender === "USER" && (
                <Avatar
                  size="md"
                  name="You"
                  border="1px solid gray"
                  src={
                    state.avatar
                      ? `http://localhost:8084${state.avatar}`
                      : "/src/assets/images/defaultProfile.jpg"
                  }
                />
              )}
            </HStack>
          );
        })}

        {loading && <Spinner alignSelf="center" />}
      </VStack>

      {/* 0단계: 메뉴 선택 */}
      {!mode && (
        <HStack spacing={4}>
          {menuItems.map((item) => (
            <Button key={item.key} onClick={() => handleMenuClick(item)} flex={1}>
              {item.label}
            </Button>
          ))}
        </HStack>
      )}

      {/* 입력창 */}
      {(mode === "similar" || mode === "translate" || mode === "recommend") && (
        <HStack>
          <Input
            placeholder={
              mode === "similar"
                ? "‘제목 - 아티스트’를 직접 입력하거나 오른쪽에서 곡을 선택하세요"
                : "여기에 입력하세요"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            isDisabled={loading}
          />
          <IconButton
            icon={<ArrowRightIcon />}
            aria-label="Send"
            onClick={handleSend}
            isLoading={loading}
          />
        </HStack>
      )}
    </Box>
  );
});

export default GuidedChat;
