import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Image,
  Spinner,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { FiMusic } from "react-icons/fi";

const STORES = ["US", "KR"];
const RAPID_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const PAGE_SIZE = 6;

// iTunes에서 트랙 검색 (US+KR 병합, usTrack/krTrack 보관)
async function searchSongs(query, searchType) {
  const attribute = searchType === "artist" ? "artistTerm" : "songTerm";

  const promises = STORES.map((country) => {
    const url =
      `https://itunes.apple.com/search?` +
      `term=${encodeURIComponent(query)}` +
      `&entity=song` +
      `&attribute=${attribute}` +
      `&limit=200` +
      `&country=${country}` +
      `&lang=ko_kr`;
    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`iTunes 검색 실패 (${res.status})`);
        return res.json();
      })
      .then((json) => (json.results || []).map((item) => ({ ...item, country })));
  });

  const all = (await Promise.all(promises)).flat();

  // trackId 기준 중복 제거 + usTrack/krTrack 분리 저장
  const map = new Map();
  all.forEach((item) => {
    const existing = map.get(item.trackId) || { ...item, usTrack: undefined, krTrack: undefined };
    if (item.country === "US") existing.usTrack = item;
    if (item.country === "KR") existing.krTrack = item;
    map.set(item.trackId, existing);
  });

  return Array.from(map.values());
}

// 가사 가져오기 (RapidAPI Musixmatch)
async function fetchLyrics(trackName, artistName) {
  const params = new URLSearchParams({ t: trackName, a: artistName, d: "0:0", type: "json" });
  const res = await fetch(`https://${RAPID_HOST}/songs/lyrics?${params}`, {
    headers: {
      "x-rapidapi-host": RAPID_HOST,
      "x-rapidapi-key": RAPID_KEY,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`가사 조회 실패 (${res.status})`);
  const data = JSON.parse(text);
  if (Array.isArray(data)) {
    return (
      data
        .map((o) => o.text?.trim())
        .filter(Boolean)
        .join("\n") || "가사를 찾을 수 없습니다."
    );
  }
  return data.lyrics_body ?? data.message?.body?.lyrics?.lyrics_body ?? "가사를 찾을 수 없습니다.";
}

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

export default function TrackAndLyrics() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("track"); // 'track' or 'artist'
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);

  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSearch = async () => {
    if (!query.trim()) {
      setError("검색어를 입력하세요.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);
    setLyrics("");
    setPage(0);

    try {
      const list = await searchSongs(query, searchType);
      if (list.length === 0) {
        setError("검색 결과가 없습니다.");
      }
      setResults(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = async (item) => {
    // 항상 가능한 영어(US) 데이터를 우선 사용
    const track = item.usTrack || item.krTrack || item;
    setError("");
    setLoading(true);

    try {
      const raw = await fetchLyrics(track.trackName, track.artistName);
      setLyrics(prettifyLyrics(raw));
      onOpen();
    } catch (e) {
      setError("죄송해요, 이 곡의 가사는 지원되지 않습니다.");
      console.log("노래 안 뜸 :", e);
    } finally {
      setLoading(false);
    }
  };

  // 페이지네이션
  const paginated = results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pageCount = Math.ceil(results.length / PAGE_SIZE);

  return (
    <Box maxW="600px" mx="auto" p={4} mt="-46px">
      <HStack spacing={2} mb={4}>
        <FiMusic size="24px" />
        <Text fontSize="2xl">가사 검색하기</Text>
      </HStack>

      <HStack mb={3} spacing={2}>
        <Select w="130px" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="track">곡 제목</option>
          <option value="artist">아티스트명</option>
        </Select>
        <Input
          flex={1}
          placeholder={searchType === "artist" ? "아티스트명" : "곡 제목"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <Button onClick={onSearch} isLoading={loading}>
          검색
        </Button>
      </HStack>

      {error && (
        <Text color="red.400" mb={2}>
          {error}
        </Text>
      )}
      {loading && !lyrics && <Spinner mb={4} />}

      <VStack spacing={2} align="stretch">
        {paginated.map((item) => {
          const track = item.usTrack || item.krTrack || item;
          return (
            <HStack
              key={track.trackId}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              onClick={() => onSelect(item)}
            >
              {track.artworkUrl100 && (
                <Image boxSize="60px" src={track.artworkUrl100} alt={track.trackName} borderRadius="md" />
              )}
              <Box>
                <Text fontWeight="semibold">{track.trackName}</Text>
                <Text fontSize="sm" color="gray.600">
                  {track.artistName}
                </Text>
                {track.releaseDate && (
                  <Text fontSize="xs" color="gray.500">
                    {track.releaseDate.slice(0, 10)}
                  </Text>
                )}
              </Box>
            </HStack>
          );
        })}
      </VStack>

      {pageCount > 1 && (
        <HStack justify="center" mt={4} spacing={4}>
          <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} isDisabled={page === 0}>
            이전
          </Button>
          <Text>
            {page + 1} / {pageCount}
          </Text>
          <Button onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))} isDisabled={page === pageCount - 1}>
            다음
          </Button>
        </HStack>
      )}

      {/* 가사 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>가사 보기</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="60vh" overflowY="auto">
            <Box whiteSpace="pre-wrap" fontSize="sm" lineHeight="tall">
              {lyrics}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
