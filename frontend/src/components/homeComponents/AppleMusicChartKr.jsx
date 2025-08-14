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

const AppleMusicChartKr = ({
  country = "kr",
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
        <Heading size="md">Apple Music Most Played — 한국</Heading>
        <Badge colorScheme="pink" variant="subtle">
          Top 50
        </Badge>
        <Spacer />
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

export default AppleMusicChartKr;

// 리스트 로딩 버전========================================================

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Heading,
//   Text,
//   Image,
//   HStack,
//   VStack,
//   Badge,
//   Link,
//   Skeleton,
//   IconButton,
//   Tooltip,
//   useToast,
//   Divider,
//   Flex,
//   Spacer,
//   Button,
// } from "@chakra-ui/react";
// import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";

// function upscaleArtwork(url = "", size = 1000) {
//   try {
//     return url.replace(/\/(\d+)x(\d+)(bb|cc)\./, `/${size}x${size}$3.`);
//   } catch {
//     return url;
//   }
// }

// const AppleMusicChart = ({ country = "kr" }) => {
//   const toast = useToast();
//   const [items, setItems] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [visibleCount, setVisibleCount] = useState(20);

//   const endpoint = useMemo(
//     () => `/apple-feed/api/v2/${country}/music/most-played/50/songs.json`,
//     [country]
//   );

//   useEffect(() => {
//     let isCancelled = false;
//     const controller = new AbortController();

//     async function load() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(endpoint, { signal: controller.signal });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         if (isCancelled) return;

//         const results = json?.feed?.results ?? [];
//         setLastUpdated(json?.feed?.updated ?? "");
//         setItems(results);
//       } catch (err) {
//         if (isCancelled) return;
//         console.error(err);
//         setError(err.message || "차트를 불러오지 못했습니다");
//         toast({
//           title: "차트 로딩 실패",
//           description: `${err?.message ?? err}`,
//           status: "error",
//           isClosable: true,
//         });
//       } finally {
//         if (!isCancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       isCancelled = true;
//       controller.abort();
//     };
//   }, [endpoint, toast, refreshKey]);

//   useEffect(() => {
//     function handleScroll() {
//       if (
//         window.innerHeight + document.documentElement.scrollTop + 100 >=
//         document.documentElement.offsetHeight
//       ) {
//         setVisibleCount((prev) => Math.min(prev + 10, items.length));
//       }
//     }
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [items.length]);

//   return (
//     <Box w="full">
//       <Flex align="center" mb={4} gap={3} wrap="wrap">
//         <Heading size="lg">Apple Music Most Played — 한국</Heading>
//         <Badge colorScheme="pink" variant="subtle">
//           Top 50
//         </Badge>
//         <Spacer />
//         <HStack>
//           {lastUpdated && (
//             <Text fontSize="sm" color="gray.500">
//               업데이트: {new Date(lastUpdated).toLocaleString()}
//             </Text>
//           )}
//           <Tooltip label="새로고침">
//             <IconButton
//               aria-label="refresh"
//               icon={<RepeatIcon boxSize={4} />}
//               onClick={() => setRefreshKey((k) => k + 1)}
//               size="sm"
//               variant="ghost"
//             />
//           </Tooltip>
//         </HStack>
//       </Flex>

//       <Divider mb={4} />

//       {error && (
//         <Box
//           bg="red.50"
//           border="1px solid"
//           borderColor="red.200"
//           rounded="xl"
//           p={4}
//           mb={4}
//         >
//           <Text color="red.700" fontWeight="semibold">
//             문제가 발생했습니다
//           </Text>
//           <Text color="red.700" fontSize="sm">
//             {String(error)}
//           </Text>
//           <Button mt={3} size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
//             다시 시도
//           </Button>
//         </Box>
//       )}

//       <VStack spacing={3} align="stretch">
//         {(loading
//           ? Array.from({ length: visibleCount })
//           : items.slice(0, visibleCount)
//         ).map((item, idx) => {
//           const art = item?.artworkUrl100
//             ? upscaleArtwork(item.artworkUrl100, 200)
//             : undefined;

//           return (
//             <Flex
//               key={item?.id ?? idx}
//               p={3}
//               borderWidth="1px"
//               rounded="lg"
//               align="center"
//               gap={4}
//               _hover={{
//                 shadow: "md",
//                 bg: "gray.50",
//                 transition: "all 0.15s ease",
//               }}
//             >
//               {/* 순위 */}
//               <Badge
//                 colorScheme="pink"
//                 fontSize="lg"
//                 px={3}
//                 py={1}
//                 rounded="md"
//                 minW="50px"
//                 textAlign="center"
//               >
//                 #{idx + 1}
//               </Badge>

//               {/* 앨범 커버 */}
//               <Skeleton isLoaded={!loading} rounded="md">
//                 {art ? (
//                   <Image
//                     src={art}
//                     alt={item?.name ?? "cover"}
//                     boxSize="64px"
//                     rounded="md"
//                     objectFit="cover"
//                   />
//                 ) : (
//                   <Box boxSize="64px" rounded="md" bg="gray.100" />
//                 )}
//               </Skeleton>

//               {/* 제목 / 아티스트 */}
//               <VStack align="start" spacing={0} flex={1} minW={0}>
//                 <Skeleton isLoaded={!loading} w="full">
//                   <Text
//                     noOfLines={1}
//                     fontWeight="semibold"
//                     fontSize="md"
//                     isTruncated
//                   >
//                     {item?.name || "\u00A0"}
//                   </Text>
//                 </Skeleton>
//                 <Skeleton isLoaded={!loading} w="full">
//                   <Text noOfLines={1} fontSize="sm" color="gray.600">
//                     {item?.artistName || "\u00A0"}
//                   </Text>
//                 </Skeleton>
//               </VStack>

//               {/* 발매일 / 링크 */}
//               <VStack align="end" spacing={1} minW="100px">
//                 {item?.releaseDate && (
//                   <Text fontSize="xs" color="gray.500">
//                     발매: {new Date(item.releaseDate).toLocaleDateString()}
//                   </Text>
//                 )}
//                 {item?.url && (
//                   <Link
//                     href={item.url}
//                     isExternal
//                     fontSize="sm"
//                     color="blue.500"
//                   >
//                     듣기 <ExternalLinkIcon ml={1} />
//                   </Link>
//                 )}
//               </VStack>
//             </Flex>
//           );
//         })}
//       </VStack>
//     </Box>
//   );
// };

// export default AppleMusicChart;

// 아래 카드 버전=======================================================

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Heading,
//   Text,
//   SimpleGrid,
//   Image,
//   HStack,
//   VStack,
//   Badge,
//   Link,
//   Skeleton,
//   IconButton,
//   Tooltip,
//   useToast,
//   Divider,
//   Flex,
//   Spacer,
//   Button,
// } from "@chakra-ui/react";
// import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";

// // Apple Music "Most Played" RSS (JSON) - 한국 Top 50
// // ✅ Vite 미들웨어 경유: /apple-feed → https://rss.marketingtools.apple.com

// function upscaleArtwork(url = "", size = 1000) {
//   try {
//     return url.replace(/\/(\d+)x(\d+)(bb|cc)\./, `/${size}x${size}$3.`);
//   } catch {
//     return url;
//   }
// }

// const AppleMusicChart = ({ country = "kr" }) => {
//   const toast = useToast();
//   const [items, setItems] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [visibleCount, setVisibleCount] = useState(10); // 초기에 10개만 표시

//   // ✅ 미들웨어 경유 URL (CORS/리다이렉트 무관)
//   const endpoint = useMemo(
//     () => `/apple-feed/api/v2/${country}/music/most-played/50/songs.json`,
//     [country]
//   );

//   useEffect(() => {
//     let isCancelled = false;
//     const controller = new AbortController();

//     async function load() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(endpoint, { signal: controller.signal });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         if (isCancelled) return;

//         const results = json?.feed?.results ?? [];
//         setLastUpdated(json?.feed?.updated ?? "");
//         setItems(results);
//       } catch (err) {
//         if (isCancelled) return;
//         console.error(err);
//         setError(err.message || "차트를 불러오지 못했습니다");
//         toast({
//           title: "차트 로딩 실패",
//           description: `${err?.message ?? err}`,
//           status: "error",
//           isClosable: true,
//         });
//       } finally {
//         if (!isCancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       isCancelled = true;
//       controller.abort();
//     };
//   }, [endpoint, toast, refreshKey]);

//   // 스크롤 이벤트로 추가 곡 로드
//   useEffect(() => {
//     function handleScroll() {
//       if (
//         window.innerHeight + document.documentElement.scrollTop + 100 >=
//         document.documentElement.offsetHeight
//       ) {
//         setVisibleCount((prev) => Math.min(prev + 10, items.length));
//       }
//     }
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [items.length]);

//   return (
//     <Box w="full">
//       <Flex align="center" mb={4} gap={3} wrap="wrap">
//         <Heading size="lg">Apple Music Most Played — 한국</Heading>
//         <Badge colorScheme="pink" variant="subtle">
//           Top 50
//         </Badge>
//         <Spacer />
//         <HStack>
//           {lastUpdated && (
//             <Text fontSize="sm" color="gray.500">
//               업데이트: {new Date(lastUpdated).toLocaleString()}
//             </Text>
//           )}
//           <Tooltip label="새로고침">
//             <IconButton
//               aria-label="refresh"
//               icon={<RepeatIcon boxSize={4} />}
//               onClick={() => setRefreshKey((k) => k + 1)}
//               size="sm"
//               variant="ghost"
//             />
//           </Tooltip>
//         </HStack>
//       </Flex>

//       <Divider mb={4} />

//       {error && (
//         <Box
//           bg="red.50"
//           border="1px solid"
//           borderColor="red.200"
//           rounded="xl"
//           p={4}
//           mb={4}
//         >
//           <Text color="red.700" fontWeight="semibold">
//             문제가 발생했습니다
//           </Text>
//           <Text color="red.700" fontSize="sm">
//             {String(error)}
//           </Text>
//           <Button mt={3} size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
//             다시 시도
//           </Button>
//         </Box>
//       )}

//       <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
//         {(loading
//           ? Array.from({ length: visibleCount })
//           : items.slice(0, visibleCount)
//         ).map((item, idx) => {
//           const art = item?.artworkUrl100
//             ? upscaleArtwork(item.artworkUrl100)
//             : undefined;

//           return (
//             <Box
//               key={item?.id ?? idx}
//               p={3}
//               borderWidth="1px"
//               rounded="2xl"
//               _hover={{
//                 shadow: "md",
//                 transform: "translateY(-2px)",
//                 transition: "all 0.15s ease",
//               }}
//             >
//               <HStack mb={3}>
//                 <Badge colorScheme="gray">#{idx + 1}</Badge>
//                 {item?.genres?.[0]?.name && (
//                   <Badge colorScheme="purple" variant="subtle">
//                     {item.genres[0].name}
//                   </Badge>
//                 )}
//               </HStack>

//               <HStack align="flex-start" spacing={3}>
//                 <Skeleton isLoaded={!loading} rounded="xl">
//                   {art ? (
//                     <Image
//                       src={art}
//                       alt={item?.name ?? "cover"}
//                       boxSize="88px"
//                       rounded="xl"
//                       objectFit="cover"
//                     />
//                   ) : (
//                     <Box boxSize="88px" rounded="xl" bg="gray.100" />
//                   )}
//                 </Skeleton>

//                 <VStack align="start" spacing={1} flex={1} minW={0}>
//                   <Skeleton isLoaded={!loading} w="full">
//                     <Text noOfLines={1} fontWeight="semibold">
//                       {item?.name || "\u00A0"}
//                     </Text>
//                   </Skeleton>
//                   <Skeleton isLoaded={!loading} w="full">
//                     <Text noOfLines={1} color="gray.600">
//                       {item?.artistName || "\u00A0"}
//                     </Text>
//                   </Skeleton>
//                   {item?.releaseDate && (
//                     <Text fontSize="xs" color="gray.500">
//                       발매: {new Date(item.releaseDate).toLocaleDateString()}
//                     </Text>
//                   )}

//                   {item?.url && (
//                     <Link
//                       href={item.url}
//                       isExternal
//                       fontSize="sm"
//                       color="blue.500"
//                     >
//                       Apple Music 열기 <ExternalLinkIcon boxSize={4} ml={1} />
//                     </Link>
//                   )}
//                 </VStack>
//               </HStack>
//             </Box>
//           );
//         })}
//       </SimpleGrid>
//     </Box>
//   );
// };
// export default AppleMusicChart;
