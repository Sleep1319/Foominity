import React, { useState, useMemo } from "react";
import { Box, Input, Button, VStack, Text, Image, Select, Spinner, HStack } from "@chakra-ui/react";
import axios from "axios";
import Fuse from "fuse.js";

const AppleMusicSearch = ({ onAlbumSelect }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("artist"); // 'artist' or 'album'
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'oldest'
  const STORES = ["US", "KR"];

  const searchAppleMusic = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const entity = "album";
      const attribute = searchType === "artist" ? "artistTerm" : "albumTerm";

      // 여러 스토어에서 동시 검색
      const promises = STORES.map((country) => {
        const url = [
          "https://itunes.apple.com/search?",
          `term=${encodeURIComponent(keyword)}`,
          "&media=music",
          `&entity=${entity}`,
          `&attribute=${attribute}`,
          "&limit=200",
          `&country=${country}`,
          "&lang=ko_kr",
        ].join("");
        return axios.get(url).then((res) => res.data.results || []);
      });

      const allItems = (await Promise.all(promises)).flat();
      const deduped = Array.from(new Map(allItems.map((item) => [item.collectionId, item])).values());

      // 한글 키워드 감지 후 Fuse 적용 여부
      const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(keyword);
      const filtered = !isKorean
        ? new Fuse(deduped, {
            keys: searchType === "artist" ? ["artistName"] : ["collectionName"],
            threshold: 0.3,
          })
            .search(keyword)
            .map((r) => r.item)
        : deduped;

      setResults(filtered);
    } catch (err) {
      console.error(err);
      alert(`검색 오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 및 우선순위 적용: 정확 일치하는 항목을 맨 위로
  const sortedResults = useMemo(() => {
    const keyLower = keyword.trim().toLowerCase();
    const [priority, others] = results.reduce(
      ([p, o], item) => {
        const target = searchType === "artist" ? item.artistName : item.collectionName;
        if (target.toLowerCase() === keyLower) p.push(item);
        else o.push(item);
        return [p, o];
      },
      [[], []]
    );

    const sortFn = (a, b) => {
      const da = new Date(a.releaseDate);
      const db = new Date(b.releaseDate);
      return sortOrder === "newest" ? db - da : da - db;
    };

    return [...priority.sort(sortFn), ...others.sort(sortFn)];
  }, [results, sortOrder, keyword, searchType]);

  return (
    <Box w="100%" mt={8} p={4} bg="gray.50" borderRadius="md" mb={4}>
      <VStack spacing={4} align="stretch">
        <HStack gap={2}>
          <Select w="110px" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="artist">아티스트</option>
            <option value="album">앨범</option>
          </Select>
          <Input
            flex={1}
            placeholder={searchType === "artist" ? "아티스트명" : "앨범명"}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchAppleMusic()}
          />
          <Select w="108px" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
          </Select>
          <Button onClick={searchAppleMusic} isLoading={loading}>
            검색
          </Button>
        </HStack>

        {loading && <Spinner alignSelf="center" />}

        {!loading && sortedResults.length === 0 && keyword && (
          <Text fontSize="sm" color="gray.500" textAlign="center">
            검색 결과가 없습니다.
          </Text>
        )}

        <VStack spacing={2} align="stretch">
          {sortedResults.map((item) => (
            <Box
              key={item.collectionId}
              display="flex"
              alignItems="center"
              gap={3}
              p={2}
              bg="white"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "purple.50" }}
              border="1px solid #eee"
              onClick={() =>
                onAlbumSelect?.({
                  title: item.collectionName,
                  artistName: item.artistName,
                  releaseDate: item.releaseDate,
                  imageUrl: item.artworkUrl100?.replace("100x100", "600x600") || "",
                  collectionId: item.collectionId,
                  tracks: [],
                })
              }
            >
              {item.artworkUrl100 && (
                <Image
                  src={item.artworkUrl100.replace("100x100", "600x600")}
                  alt={item.collectionName}
                  boxSize="60px"
                  borderRadius="md"
                />
              )}
              <Box>
                <Text fontWeight="bold">{item.collectionName}</Text>
                <Text fontSize="sm" color="gray.600">
                  {item.artistName}
                </Text>
                {item.releaseDate && (
                  <Text fontSize="xs" color="gray.500">
                    {item.releaseDate.slice(0, 10)}
                  </Text>
                )}
              </Box>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default AppleMusicSearch;
