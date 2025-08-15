import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Text,
  HStack,
  Button,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FEED_URL = "https://pitchfork.com/feed/feed-news/rss";

// 프록시 (CORS 우회 필요시)
const ALLOW_PUBLIC_PROXY = true;
const toProxyUrl = (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

// localStorage 키
const LS_BASELINE_MISSING = "admin_mag_baseline_missing"; // 기준 '안 가져온 뉴스'
const LS_LAST_EXT_COUNT = "admin_mag_last_ext_count"; // 마지막 외부 유니크 개수
const LS_INT_BASE_COUNT = "admin_mag_int_base_count"; // 기준 시점 내부 총개수
const BASELINE_DEFAULT = 30;

// 안전 숫자 헬퍼
const getNumber = (key, fallback) => {
  const raw = localStorage.getItem(key);
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};
const setNumber = (key, val) => localStorage.setItem(key, String(val));

// 문자열 정규화
const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

function parseExternalFeed(text) {
  try {
    const asJson = JSON.parse(text);
    if (Array.isArray(asJson?.items)) {
      return asJson.items.map((it) => ({
        title: it.title ?? "",
        link: it.link ?? "",
      }));
    }
  } catch {
    // XML로 진행
  }
  const doc = new DOMParser().parseFromString(text, "text/xml");
  const items = [...doc.querySelectorAll("item, entry")].map((el) => {
    const title =
      el.querySelector("title")?.textContent?.trim() ||
      el.querySelector("title[type='text']")?.textContent?.trim() ||
      "";
    const link =
      el.querySelector("link[href]")?.getAttribute("href")?.trim() ||
      el.querySelector("link")?.textContent?.trim() ||
      "";
    return { title, link };
  });
  return items;
}

export default function AdminMagazine() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [extItems, setExtItems] = useState(null); 
  const [intItems, setIntItems] = useState(null); 
  const [intRaw, setIntRaw] = useState([]); 

  
  const [baselineMissing, setBaselineMissing] = useState(() => getNumber(LS_BASELINE_MISSING, BASELINE_DEFAULT));
  const [intBaselineCount, setIntBaselineCount] = useState(() => {
    const v = localStorage.getItem(LS_INT_BASE_COUNT);
    const n = Number(v);
    return Number.isFinite(n) ? n : null; 
  });
  const [error, setError] = useState(null);

  
  const ROWS_PER_PAGE = 7;
  const ITEMS_PER_ROW = 3;
  const NOTICES_PER_PAGE = ROWS_PER_PAGE * ITEMS_PER_ROW; 
  const [page, setPage] = useState(0);

  useEffect(() => {
    const stored = getNumber(LS_BASELINE_MISSING, BASELINE_DEFAULT);
    if (!Number.isFinite(stored) || stored < BASELINE_DEFAULT) {
      setNumber(LS_BASELINE_MISSING, BASELINE_DEFAULT);
      setBaselineMissing(BASELINE_DEFAULT);
    }
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) 내부 공지
      const intRes = await axios.get("/api/notices", {
        withCredentials: true,
        params: { t: Date.now() }, 
      });

      const data = intRes.data || [];
      setIntRaw(data); 
      const internal = data.map((n) => ({
        title: n.title ?? "",
        link: n.link ?? "",
      }));
      setIntItems(internal);

      const currentIntCount = internal.length;
      if (intBaselineCount === null) {
        setIntBaselineCount(currentIntCount);
        setNumber(LS_INT_BASE_COUNT, currentIntCount);
      }

      // 2) 외부 피드
      const tsFeed = FEED_URL + (FEED_URL.includes("?") ? "&" : "?") + "_=" + Date.now();
      const tryUrls = [tsFeed];
      if (ALLOW_PUBLIC_PROXY) tryUrls.push(toProxyUrl(tsFeed));

      let externalText = null;
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`fetch fail: ${res.status}`);
          externalText = await res.text();
          if (externalText) break;
        } catch {
          // 다음 후보
        }
      }
      if (!externalText) throw new Error("외부 피드 불러오기 실패 (CORS/네트워크)");

      const parsed = parseExternalFeed(externalText);
      setExtItems(parsed);

      const extKeys = new Set(parsed.map((e) => norm(e.link) || norm(e.title)).filter(Boolean));
      const currentExtCount = extKeys.size;

      let base = getNumber(LS_BASELINE_MISSING, BASELINE_DEFAULT);
      if (!Number.isFinite(base) || base < BASELINE_DEFAULT) {
        base = BASELINE_DEFAULT;
      }

      const lastExtCount = getNumber(LS_LAST_EXT_COUNT, currentExtCount);
      if (currentExtCount > lastExtCount) {
        base += currentExtCount - lastExtCount; 
      }
      setNumber(LS_LAST_EXT_COUNT, currentExtCount);
      setNumber(LS_BASELINE_MISSING, base);
      setBaselineMissing(base);
    } catch (e) {
      console.error(e);
      setError(e?.message || "불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(); 
    
  }, []);

  // 내부/외부 통계
  const { missingCount, extTotal, intTotal } = useMemo(() => {
    const intTotal = Array.isArray(intItems) ? intItems.length : null;
    const extTotal = Array.isArray(extItems)
      ? new Set(extItems.map((e) => norm(e.link) || norm(e.title)).filter(Boolean)).size
      : null;

    let missing = null;
    if (intTotal !== null && intBaselineCount !== null) {
      const producedSinceBaseline = Math.max(intTotal - intBaselineCount, 0);
      missing = Math.max(baselineMissing - producedSinceBaseline, 0); 
    }
    return { missingCount: missing, extTotal, intTotal };
  }, [intItems, extItems, baselineMissing, intBaselineCount]);

  // 날짜 포맷
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  // 줄 리스트용 정렬 + 페이지 데이터
  const sortedInt = useMemo(
    () =>
      intRaw
        .slice()
        .sort((a, b) => new Date(b.publishedDate || b.createdDate) - new Date(a.publishedDate || a.createdDate)),
    [intRaw]
  );
  const totalPages = Math.ceil(sortedInt.length / NOTICES_PER_PAGE) || 1;
  const start = page * NOTICES_PER_PAGE;
  const pageItems = sortedInt.slice(start, start + NOTICES_PER_PAGE);

  // 데이터 바뀌어 페이지가 범위를 넘어가면 보정
  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(totalPages - 1, 0));
  }, [totalPages, page]);

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={2}>
      <HStack justify="space-between" mb={4}>
        <HStack>
          {error && (
            <Tooltip label={error} hasArrow>
              <Badge colorScheme="orange" variant="subtle">
                프런트 추정치
              </Badge>
            </Tooltip>
          )}
          
          <Button
            size="sm"
            onClick={() => navigate("/notice/create")}
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            isLoading={false}
          >
            뉴스 불러오기
          </Button>
        </HStack>
      </HStack>

      {/* ===== 매거진 관리 통계 박스 ===== */}
      <Box border="1px solid #e2e8f0" borderRadius="md" p={4} mb={6}>
        <HStack spacing={10} align="center">
          <Stat>
            <StatLabel>안 가져온 뉴스</StatLabel>
            <StatNumber>{missingCount === null ? <Spinner size="sm" /> : missingCount}</StatNumber>
          </Stat>
          <Divider orientation="vertical" h="36px" />
          <Stat>
            <StatLabel>외부 뉴스 총합</StatLabel>
            <StatNumber>{extTotal === null ? <Spinner size="sm" /> : extTotal}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>내부 등록 뉴스</StatLabel>
            <StatNumber>{intTotal === null ? <Spinner size="sm" /> : intTotal}</StatNumber>
          </Stat>

          {/* 새로고침 버튼 */}
          {typeof missingCount === "number" && missingCount > 0 && (
            <Button
              size="sm"
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              onClick={fetchAll}
              isLoading={loading}
            >
              새로고침
            </Button>
          )}
        </HStack>

        {error && (
          <Text mt={3} fontSize="sm" color="gray.600">
            외부 피드 CORS 이슈로 정확치 않을 수 있어요. 서버 프록시를 붙이면 더 정확한 집계가 가능합니다.
          </Text>
        )}
      </Box>

      {/* ===== 내부 뉴스 줄 리스트 (인덱스/제목/발행일) ===== */}
      <Box mt={6}>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          내부 뉴스 목록
        </Text>

        <Box border="1px solid #e2e8f0" borderRadius="md" overflow="hidden">
          {/* 헤더 */}
          <Box px={4} py={2} bg="white" borderBottom="1px solid" borderColor="gray.200">
            <HStack>
              <Box w="60px" textAlign="center" fontWeight="bold">
                번호
              </Box>
              <Box flex="1" fontWeight="bold">
                제목
              </Box>
              <Box w="130px" textAlign="right" fontWeight="bold">
                발행일
              </Box>
            </HStack>
          </Box>

          
          {pageItems.length === 0 ? (
            <Box p={6} textAlign="center" color="gray.500">
              등록된 뉴스가 없습니다.
            </Box>
          ) : (
            pageItems.map((n, idx) => {
              const no = sortedInt.length - (start + idx); 
              return (
                <Box
                  key={`${n.id}-${idx}`}
                  px={4}
                  py={3}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                  
                  onClick={() => navigate(`/notice/${n.id}?from=admin`, { state: { from: "admin" } })}
                >
                  <HStack align="center" gap={4}>
                    <Box w="60px" textAlign="center">
                      {no}
                    </Box>
                    <Box flex="1" pr={3}>
                      <Text noOfLines={1} fontWeight="semibold" _hover={{ textDecoration: "underline" }}>
                        {n.title}
                      </Text>
                    </Box>
                    <Box w="130px" textAlign="right" color="gray.600">
                      {formatDate(n.publishedDate || n.createdDate)}
                    </Box>
                  </HStack>
                </Box>
              );
            })
          )}
        </Box>

        {/* 페이지네이션 */}
        <HStack spacing={2} justify="center" mt={12}>
          <Button
            size="sm"
            bg="white"
            color="black"
            border="1px solid black"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            isDisabled={page === 0}
          >
            이전
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              bg={i === page ? "black" : "white"}
              color={i === page ? "white" : "black"}
              border="1px solid black"
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            size="sm"
            bg="white"
            color="black"
            border="1px solid black"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            isDisabled={page >= totalPages - 1}
          >
            다음
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
