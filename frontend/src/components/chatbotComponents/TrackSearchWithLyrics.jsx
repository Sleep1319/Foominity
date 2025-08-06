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

const RAPID_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

// iTunes 검색
async function searchTracks(query, searchType) {
  const attribute = searchType === "artist" ? "artistTerm" : "songTerm";
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    query
  )}&entity=song&attribute=${attribute}&limit=200`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("iTunes 검색 실패");
  const { results } = await res.json();
  return results;
}

// 가사 가져오기
async function fetchLyrics(trackName, artistName) {
  const params = new URLSearchParams({ t: trackName, a: artistName, d: "0:0", type: "json" });
  const url = `https://${RAPID_HOST}/songs/lyrics?${params}`;
  const res = await fetch(url, {
    headers: {
      "x-rapidapi-host": RAPID_HOST,
      "x-rapidapi-key": RAPID_KEY,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`가사 조회 실패 (${res.status})`);
  let data = JSON.parse(text);
  if (Array.isArray(data)) {
    const lines = data.map((o) => o.text?.trim()).filter(Boolean);
    return lines.join("\n") || "가사를 찾을 수 없습니다.";
  }
  return data.lyrics_body ?? data.message?.body?.lyrics?.lyrics_body ?? "가사를 찾을 수 없습니다.";
}

// 가사 정제
function prettifyLyrics(rawText) {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/([.!?])(\s+|$)/g, "$1\n"))
    .join("\n")
    .replace(/\n{2,}/g, "\n\n");
}

export default function TrackAndLyrics() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("track");
  const [allTracks, setAllTracks] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSearch = async () => {
    setError("");
    setLyrics("");
    setAllTracks([]);
    setPage(0);
    if (!query.trim()) {
      setError("검색어를 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const list = await searchTracks(query, searchType);
      list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      setAllTracks(list);
      if (list.length === 0) setError("검색 결과가 없습니다.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = async (track) => {
    setError("");
    setLyrics("");
    setLoading(true);
    try {
      const rawText = await fetchLyrics(track.trackName, track.artistName);
      const pretty = prettifyLyrics(rawText);
      setLyrics(pretty);
      onOpen(); // 모달 열기
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const paginated = allTracks.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <HStack spacing={2} mb={4}>
        <FiMusic size="24px" />
        <Text fontSize="2xl">트랙 검색 & 가사 보기</Text>
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

      <VStack spacing={2} align="stretch">
        {paginated.map((t) => (
          <HStack
            key={t.trackId}
            p={2}
            borderWidth="1px"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            onClick={() => onSelect(t)}
          >
            <Image boxSize="60px" src={t.artworkUrl100} alt={t.trackName} borderRadius="md" />
            <Box>
              <Text fontWeight="semibold">{t.trackName}</Text>
              <Text fontSize="sm" color="gray.600">
                {t.artistName}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>

      {loading && !lyrics && <Spinner mt={4} />}

      {allTracks.length > pageSize && (
        <HStack justify="center" mt={4} spacing={4}>
          <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} isDisabled={page === 0}>
            이전
          </Button>
          <Text>
            {page + 1} / {Math.ceil(allTracks.length / pageSize)}
          </Text>
          <Button onClick={() => setPage((p) => p + 1)} isDisabled={(page + 1) * pageSize >= allTracks.length}>
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
          <ModalBody>
            <Box whiteSpace="pre-wrap" fontSize="sm" lineHeight="tall">
              {lyrics}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
