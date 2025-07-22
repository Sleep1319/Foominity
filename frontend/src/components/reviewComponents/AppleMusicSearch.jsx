import React, { useState } from "react";
import { Box, Input, Button, VStack, Text, Image, Select } from "@chakra-ui/react";
import axios from "axios";

const AppleMusicSearch = ({ onAlbumSelect }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("artist"); // 'artist' or 'album'
  const [country] = useState("US"); // KR 또는 US, 필요시 옵션 추가

  const searchAppleMusic = async () => {
    setLoading(true);
    setResults([]);
    try {
      // iTunes Search API (searchType에 따라 entity 변경 가능하지만 album 고정)
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
        keyword
      )}&entity=album&limit=30&country=${country}`;
      const res = await axios.get(url);
      let albums = res.data.results;

      if (searchType === "artist") {
        // 부분 포함(띄어쓰기 무시) 일치 허용 (ex. TravisScott, travis scott)
        const normKeyword = keyword.toLowerCase().replace(/\s/g, "");
        albums = albums.filter(
          (album) => album.artistName && album.artistName.toLowerCase().replace(/\s/g, "").includes(normKeyword)
        );
      } else if (searchType === "album") {
        const normKeyword = keyword.toLowerCase().replace(/\s/g, "");
        albums = albums.filter(
          (album) => album.collectionName && album.collectionName.toLowerCase().replace(/\s/g, "").includes(normKeyword)
        );
      }
      setResults(albums);
    } catch (err) {
      alert("검색 오류 : ", err);
    }
    setLoading(false);
  };

  return (
    <Box w="100%" mt={8} p={4} bg="gray.50" borderRadius="md">
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        앨범 검색
      </Text>
      <VStack spacing={2} align="stretch">
        <Box display="flex" gap={2}>
          <Select w="205px" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="artist">아티스트명</option>
            <option value="album">앨범명</option>
          </Select>
          <Input
            placeholder={searchType === "artist" ? "아티스트명" : "앨범명"}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchAppleMusic()}
          />
          <Button bg="gray.200" onClick={searchAppleMusic} isLoading={loading}>
            검색
          </Button>
        </Box>
        {/* Country 선택 (선택사항) */}
        {/* <Select w="100px" value={country} onChange={e => setCountry(e.target.value)}>
          <option value="US">US</option>
          <option value="KR">KR</option>
        </Select> */}
        {results.length === 0 && !loading && (
          <Text fontSize="sm" color="gray.500" mt={3}>
            검색 결과가 없습니다.
          </Text>
        )}
        {results.length > 0 && (
          <VStack align="stretch" spacing={2} mt={2}>
            {results.map((album) => (
              <Box
                key={album.collectionId}
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
                  onAlbumSelect &&
                  onAlbumSelect({
                    title: album.collectionName,
                    artistName: album.artistName,
                    releaseDate: album.releaseDate,
                    imageUrl: album.artworkUrl100.replace("100x100", "600x600"),
                    collectionId: album.collectionId,
                    tracks: [],
                  })
                }
              >
                <Image src={album.artworkUrl100} alt={album.collectionName} boxSize="60px" borderRadius="md" />
                <Box>
                  <Text fontWeight="bold">{album.collectionName}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {album.artistName}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {album.releaseDate?.slice(0, 10)}
                  </Text>
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default AppleMusicSearch;
