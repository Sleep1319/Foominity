import React, { useState } from "react";
import {
  Box, VStack, HStack, Input, Button, Text, Image, Spinner, Select,
} from "@chakra-ui/react";
import { FiMusic } from "react-icons/fi";


const STORES = ["US", "KR"];
async function searchSongs(query, searchType = "track") {
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

const PAGE_SIZE = 6;

/**
 * props:
 *  - onPick: (seedText: string) => void  // "제목 - 아티스트"를 GuidedChat으로 보낼 콜백
 */
export default function TrackSearchForSimilar({ onPick }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("track"); // 'track' | 'artist'
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSearch = async () => {
    if (!query.trim()) {
      setError("검색어를 입력하세요.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);
    setPage(0);

    try {
      const list = await searchSongs(query.trim(), searchType);
      if (list.length === 0) setError("검색 결과가 없습니다.");
      setResults(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 클릭 시: "제목 - 아티스트" 텍스트로 즉시 전송
  // const onSelect = (item) => {
  //   const t = item.usTrack || item.krTrack || item;
  //   const seedText = `${t.trackName} - ${t.artistName}`;
  //   onPick?.(seedText);
  // };
  const onSelect = (item) => {
    const t = item.usTrack || item.krTrack || item;
    const seedText = `${t.trackName} - ${t.artistName}`;
    const meta = {
      title: t.trackName,
      artist: t.artistName,
      artworkUrl100: t.artworkUrl100,
      previewUrl: t.previewUrl,
    };
    onPick?.(seedText, meta); // 메타 함께 전달
  };

  // 페이지네이션
  const paginated = results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pageCount = Math.ceil(results.length / PAGE_SIZE);

  return (
    <Box maxW="600px" mx="auto" p={4} mt="-35px">
      <HStack spacing={2} mb={4}>
        <FiMusic size="24px" />
        <Text fontSize="2xl">검색해서 노래 전송</Text>
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

      {error && <Text color="red.400" mb={2}>{error}</Text>}
      {loading && <Spinner mb={4} />}

      <VStack spacing={2} align="stretch">
        {paginated.map((item) => {
          const t = item.usTrack || item.krTrack || item;
          return (
            <HStack
              key={t.trackId}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              onClick={() => onSelect(item)}
            >
              {t.artworkUrl100 && (
                <Image boxSize="60px" src={t.artworkUrl100} alt={t.trackName} borderRadius="md" />
              )}
              <Box>
                <Text fontWeight="semibold">{t.trackName}</Text>
                <Text fontSize="sm" color="gray.600">{t.artistName}</Text>
                {t.releaseDate && (
                  <Text fontSize="xs" color="gray.500">{t.releaseDate.slice(0, 10)}</Text>
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
          <Text>{page + 1} / {pageCount}</Text>
          <Button onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))} isDisabled={page === pageCount - 1}>
            다음
          </Button>
        </HStack>
      )}
    </Box>
  );
}
