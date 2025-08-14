import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  HStack,
  VStack,
  Badge,
  Link,
  Skeleton,
  IconButton,
  Tooltip,
  Divider,
  Flex,
  Spacer,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";

function upscaleArtwork(url = "", size = 1000) {
  try {
    return url.replace(/\/(\d+)x(\d+)(bb|cc)\./, `/${size}x${size}$3.`);
  } catch {
    return url;
  }
}

const AppleMusicChart = ({
  // country = "kr",
  country,
  boxMaxH = 420, // 인기댓글 박스에 맞춘 기본 높이
  initialVisible = 12, // 처음 보여줄 개수
  step = 8, // 스크롤/버튼으로 늘릴 때 개수
}) => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const scrollBoxRef = useRef(null);
  const sentinelRef = useRef(null);

  const endpoint = useMemo(() => `/apple-feed/api/v2/${country}/music/most-played/50/songs.json`, [country]);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (isCancelled) return;

        const results = json?.feed?.results ?? [];
        setLastUpdated(json?.feed?.updated ?? "");
        setItems(results);
        setVisibleCount(initialVisible);
      } catch (err) {
        if (isCancelled) return;
        console.error(err);
        setError(err.message || "차트를 불러오지 못했습니다");
        toast({
          title: "차트 로딩 실패",
          description: `${err?.message ?? err}`,
          status: "error",
          isClosable: true,
        });
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    load();
    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [endpoint, toast, refreshKey, initialVisible]);

  // 박스 내부 스크롤 기반 무한 스크롤
  useEffect(() => {
    if (!sentinelRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + step, items.length));
        }
      },
      {
        root: scrollBoxRef.current, // 박스 내부를 root로 지정
        rootMargin: "100px 0px",
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [items.length, loading, step]);

  const list = loading ? Array.from({ length: visibleCount }) : items.slice(0, visibleCount);
  const canLoadMore = visibleCount < items.length;
  return (
    <Box w="full">
      <Flex align="center" mb={3} gap={3} wrap="wrap">
        <HStack>
          {lastUpdated && (
            <Text fontSize="xs" color="gray.500">
              업데이트: {new Date(lastUpdated).toLocaleString()}
            </Text>
          )}
          <Tooltip label="새로고침">
            <IconButton
              aria-label="refresh"
              icon={<RepeatIcon boxSize={4} />}
              onClick={() => setRefreshKey((k) => k + 1)}
              size="xs"
              variant="ghost"
            />
          </Tooltip>
        </HStack>
      </Flex>

      <Divider mb={3} />

      {error && (
        <Box bg="red.50" border="1px solid" borderColor="red.200" rounded="xl" p={3} mb={3}>
          <Text color="red.700" fontWeight="semibold" mb={1}>
            문제가 발생했습니다
          </Text>
          <Text color="red.700" fontSize="sm">
            {String(error)}
          </Text>
          <Button mt={2} size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            다시 시도
          </Button>
        </Box>
      )}

      {/* 차트 박스 */}
      <Box
        ref={scrollBoxRef}
        maxH={`${boxMaxH}px`}
        overflowY="auto"
        borderWidth="1px"
        rounded="lg"
        p={2}
        sx={{ overscrollBehavior: "contain" }}
      >
        <VStack spacing={3} align="stretch">
          {list.map((item, idx) => {
            const art = item?.artworkUrl100 ? upscaleArtwork(item.artworkUrl100, 200) : undefined;

            return (
              <Flex
                key={item?.id ?? idx}
                p={2}
                borderWidth="1px"
                rounded="md"
                align="center"
                gap={3}
                _hover={{ shadow: "md", bg: "gray.50", transition: "all 0.15s ease" }}
              >
                <Badge
                  colorScheme={idx < 3 ? "pink" : "gray"}
                  fontSize="md"
                  px={2}
                  py={1}
                  rounded="md"
                  minW="42px"
                  textAlign="center"
                >
                  #{idx + 1}
                </Badge>

                <Skeleton isLoaded={!loading} rounded="md">
                  {art ? (
                    <Image src={art} alt={item?.name ?? "cover"} boxSize="56px" rounded="md" objectFit="cover" />
                  ) : (
                    <Box boxSize="56px" rounded="md" bg="gray.100" />
                  )}
                </Skeleton>

                <VStack align="start" spacing={0} flex={1} minW={0}>
                  <Skeleton isLoaded={!loading} w="full">
                    <Text noOfLines={1} fontWeight="semibold" fontSize="sm">
                      {item?.name || "\u00A0"}
                    </Text>
                  </Skeleton>
                  <Skeleton isLoaded={!loading} w="full">
                    <Text noOfLines={1} fontSize="xs" color="gray.600">
                      {item?.artistName || "\u00A0"}
                    </Text>
                  </Skeleton>
                </VStack>

                <VStack align="end" spacing={1} minW="90px">
                  {item?.releaseDate && (
                    <Text fontSize="xs" color="gray.500">
                      발매: {new Date(item.releaseDate).toLocaleDateString()}
                    </Text>
                  )}
                  {item?.url && (
                    <Link href={item.url} isExternal fontSize="xs" color="blue.500">
                      듣기 <ExternalLinkIcon ml={1} />
                    </Link>
                  )}
                </VStack>
              </Flex>
            );
          })}
        </VStack>

        {/* 무한 스크롤 센티널 */}
        <Box ref={sentinelRef} h="1px" />

        {canLoadMore && (
          <Box textAlign="center" mt={2}>
            <Button size="xs" onClick={() => setVisibleCount((v) => Math.min(v + step, items.length))}>
              더 보기
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AppleMusicChart;
