import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Image,
  Spinner,
  CheckboxGroup,
  Checkbox,
  Stack,
  HStack,
  IconButton,
  Text,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ReviewEdit = () => {
  const { id } = useParams(); // reviewId
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  // form states
  const [title, setTitle] = useState("");
  const [released, setReleased] = useState(""); // YYYY-MM-DD
  const [tracklist, setTracklist] = useState([""]); // List<String>

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // categories
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // string[]

  // artists (multi-select with search)
  const [artistSearch, setArtistSearch] = useState("");
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [selectedArtistIds, setSelectedArtistIds] = useState([]); // string[]
  const [selectedArtistsMeta, setSelectedArtistsMeta] = useState([]); // {artistId, name}[]

  const serverHost = useMemo(() => {
    // 이미지 경로 미리보기 용 (백엔드 정적 서빙 주소에 맞게 조정)
    return "http://localhost:8084";
  }, []);

  // 공통 목록 로딩
  useEffect(() => {
    const loadCommons = async () => {
      try {
        const [catRes, reviewRes] = await Promise.all([axios.get("/api/categories"), axios.get(`/api/reviews/${id}`)]);

        const catData = catRes.data || [];
        setCategories(catData);

        const data = reviewRes.data;
        setTitle(data.title || "");
        setReleased(data.released || ""); // "YYYY-MM-DD" 예상
        setTracklist(Array.isArray(data.tracklist) && data.tracklist.length > 0 ? data.tracklist : [""]);
        // 카테고리/아티스트 선택 초기화
        setSelectedCategoryIds((data.categoryIds || []).map(String));
        const initialArtistIds = (data.artistIds || []).map(String);
        setSelectedArtistIds(initialArtistIds);

        // 이미지 프리뷰
        if (data.imagePath) {
          setPreviewUrl(`${serverHost}/${data.imagePath}`);
        }

        // 선택된 아티스트들의 이름/메타 채우기
        if (initialArtistIds.length) {
          try {
            const metas = await Promise.all(
              initialArtistIds.map(async (aid) => {
                const res = await axios.get(`/api/artists/${aid}`);
                return { artistId: String(res.data.artistId), name: res.data.name };
              })
            );
            // 중복 제거
            const uniq = [];
            const seen = new Set();
            for (const m of metas) {
              if (!seen.has(m.artistId)) {
                uniq.push(m);
                seen.add(m.artistId);
              }
            }
            setSelectedArtistsMeta(uniq);
          } catch {
            // 메타 로딩 실패해도 편집엔 큰 문제 없음
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
        toast({ title: "리뷰 정보를 불러오지 못했습니다.", status: "error" });
        setLoading(false);
      }
    };

    loadCommons();
  }, [id, serverHost, toast]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 트랙리스트 제어
  const addTrackRow = () => setTracklist((prev) => [...prev, ""]);
  const removeTrackRow = (idx) => setTracklist((prev) => prev.filter((_, i) => i !== idx));
  const changeTrackValue = (idx, value) => setTracklist((prev) => prev.map((t, i) => (i === idx ? value : t)));

  // 아티스트 검색
  const handleArtistSearch = async () => {
    if (!artistSearch.trim()) {
      setArtistSearchResults([]);
      return;
    }
    try {
      // 백엔드 검색 쿼리 파라미터는 구현에 맞게 조정 (예: /api/artists?name=)
      const res = await axios.get("/api/artists", {
        params: { name: artistSearch.trim() },
      });
      const list = res.data || [];
      setArtistSearchResults(list);
    } catch (e) {
      console.error("아티스트 검색 실패:", e);
      toast({ title: "아티스트 검색 실패", status: "error" });
    }
  };

  // 아티스트 체크박스 선택
  const onArtistCheckChange = (vals) => {
    // vals: string[]
    setSelectedArtistIds(vals);

    // 보이는 태그 메타 업데이트 (검색 결과에 있는 항목들을 추가)
    const map = new Map(selectedArtistsMeta.map((a) => [a.artistId, a.name]));
    for (const a of artistSearchResults) {
      const key = String(a.artistId);
      if (vals.includes(key) && !map.has(key)) {
        map.set(key, a.name);
      }
    }
    const next = Array.from(map.entries()).map(([artistId, name]) => ({
      artistId,
      name,
    }));
    // 선택에서 빠진 메타는 제거
    const filtered = next.filter((m) => vals.includes(m.artistId));
    setSelectedArtistsMeta(filtered);
  };

  const removeSelectedArtist = (artistId) => {
    setSelectedArtistIds((prev) => prev.filter((id) => id !== artistId));
    setSelectedArtistsMeta((prev) => prev.filter((a) => a.artistId !== artistId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "제목은 필수입니다.", status: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("released", released || ""); // LocalDate 문자열

    // tracklist(List<String>)
    tracklist.filter((t) => t !== null && t !== undefined).forEach((t) => formData.append("tracklist", t ?? ""));

    // image(MultipartFile)
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // categoryIds(List<Long>)
    selectedCategoryIds.forEach((cid) => formData.append("categoryIds", cid));

    // artistIds(List<Long>)
    selectedArtistIds.forEach((aid) => formData.append("artistIds", aid));

    try {
      await axios.put(`/api/reviews/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast({ title: "리뷰 수정 완료", status: "success", duration: 2000 });
      navigate(`/review/${id}`);
    } catch (err) {
      console.error("리뷰 수정 실패:", err);
      toast({ title: "수정 실패", status: "error", duration: 2000 });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} px={4}>
      <Heading mb={6}>리뷰 수정</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* 제목 */}
          <FormControl isRequired>
            <FormLabel>제목</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </FormControl>

          {/* 발매일 */}
          <FormControl>
            <FormLabel>발매일</FormLabel>
            <Input type="date" value={released} onChange={(e) => setReleased(e.target.value)} />
          </FormControl>

          {/* 카테고리 */}
          <FormControl>
            <FormLabel>카테고리</FormLabel>
            <CheckboxGroup value={selectedCategoryIds} onChange={(val) => setSelectedCategoryIds(val)}>
              <Stack direction="row" wrap="wrap">
                {categories.map((cat) => (
                  <Checkbox key={cat.categoryId} value={String(cat.categoryId)}>
                    {cat.categoryName}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>

          {/* 아티스트 (다중 선택 + 검색) */}
          <FormControl>
            <FormLabel>아티스트</FormLabel>
            <HStack>
              <Input
                placeholder="아티스트 검색"
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleArtistSearch();
                  }
                }}
              />
              <IconButton aria-label="검색" icon={<SearchIcon />} onClick={handleArtistSearch} />
            </HStack>

            {/* 선택된 아티스트 표시 */}
            {selectedArtistsMeta.length > 0 && (
              <>
                <HStack spacing={2} mt={3} wrap="wrap">
                  {selectedArtistsMeta.map((a) => (
                    <Tag size="md" key={a.artistId} borderRadius="md" variant="subtle">
                      <TagLabel>{a.name}</TagLabel>
                      <TagCloseButton onClick={() => removeSelectedArtist(a.artistId)} />
                    </Tag>
                  ))}
                </HStack>
                <Divider my={3} />
              </>
            )}

            {/* 검색 결과 체크박스 */}
            {artistSearchResults.length > 0 && (
              <CheckboxGroup value={selectedArtistIds} onChange={onArtistCheckChange}>
                <Stack direction="row" wrap="wrap" mt={2}>
                  {artistSearchResults.map((a) => (
                    <Checkbox key={a.artistId} value={String(a.artistId)}>
                      {a.name}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
          </FormControl>

          {/* 트랙리스트 */}
          <FormControl>
            <FormLabel>트랙리스트</FormLabel>
            <VStack spacing={2} align="stretch">
              {tracklist.map((t, idx) => (
                <HStack key={idx}>
                  <Input
                    placeholder={`트랙 ${idx + 1} 제목`}
                    value={t ?? ""}
                    onChange={(e) => changeTrackValue(idx, e.target.value)}
                  />
                  <IconButton
                    aria-label="삭제"
                    icon={<DeleteIcon />}
                    onClick={() => removeTrackRow(idx)}
                    variant="outline"
                  />
                </HStack>
              ))}
              <Button onClick={addTrackRow} leftIcon={<AddIcon />} variant="outline" alignSelf="flex-start">
                트랙 추가
              </Button>
              <Text fontSize="sm" color="gray.500">
                * 서버 DTO는 <b>List&lt;String&gt; tracklist</b>를 받습니다. (트랙명만 전송)
              </Text>
            </VStack>
          </FormControl>

          {/* 이미지 업로드 */}
          <FormControl>
            <FormLabel>이미지 업로드</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </FormControl>

          {previewUrl && <Image src={previewUrl} alt="preview" boxSize="200px" objectFit="cover" borderRadius="md" />}

          <Button type="submit" colorScheme="blue">
            저장
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ReviewEdit;
