import React from "react";
import { Box, Image, Text, VStack, HStack, Link as ChakraLink, SimpleGrid, Divider } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const newsData = [
  {
    id: 1,
    title: "Blood Orange Shares Video for New Song “The Field”",
    writer: "Madison Bloom",
    date: "2025-06-26",
    image: "/images/news1.jpg",
    to: "/notice/1",
    imageWidth: "1100px",
    imageHeight: "500px",
  },
  {
    id: 2,
    title: "Oklou Releases New Remix EP Featuring Nick León, Malibu, and More",
    writer: "Jazz Monroe",
    date: "2025-06-25",
    image: "/images/news2.jpg",
    to: "/notice/2",
    imageWidth: "360px",
    imageHeight: "200px",
  },
  {
    id: 3,
    title: "Watch Justin Vernon Play a Divorce Attorney in Bon Iver’s New Video",
    writer: "Pitchfork Staff",
    date: "2025-06-24",
    image: "/images/news3.jpg",
    to: "/notice/3",
    imageWidth: "360px",
    imageHeight: "200px",
  },
];

const moreNews = [
  {
    id: 4,
    title: "Arctic Monkeys Announce Surprise Tour in 2025",
    date: "2025-06-23",
    image: "/images/news4.jpg",
    to: "/notice/4",
  },
  {
    id: 5,
    title: "Phoebe Bridgers and The 1975 Collaboration Confirmed",
    date: "2025-06-22",
    image: "/images/news5.jpg",
    to: "/notice/5",
  },
  {
    id: 6,
    title: "The Strokes Drop New Album Without Notice",
    date: "2025-06-21",
    image: "/images/news6.jpg",
    to: "/notice/6",
  },
];

const NoticeTable = () => {
  // 1. 모든 뉴스 합치고 2. 날짜순 정렬 (최신순)
  const allNews = [...newsData, ...moreNews].sort((a, b) => new Date(b.date) - new Date(a.date));

  const mainNews = allNews[0];
  const sideNews = allNews.slice(1, 3);
  const restNews = allNews.slice(3);

  return (
    <VStack spacing={12} maxW="8xl" mx="auto" py={8} px={4} align="stretch">
      {/* 상단 레이아웃 */}
      <HStack spacing={6} align="start" flexWrap="wrap">
        {/* Main 큰 뉴스 */}
        <VStack align="start" spacing={3} flex="2">
          <Image
            src={mainNews.image}
            alt={mainNews.title}
            width={mainNews.imageWidth || "1100px"}
            height={mainNews.imageHeight || "500px"}
            objectFit="cover"
            borderRadius="md"
          />
          <Text fontSize="xs" color="gray.500" fontWeight="medium">
            NEWS
          </Text>
          <ChakraLink
            as={RouterLink}
            to={mainNews.to}
            fontWeight="bold"
            fontSize="2xl"
            _hover={{ textDecoration: "underline", color: "black" }}
          >
            {mainNews.title}
          </ChakraLink>
          <Text fontSize="sm" color="gray.600">
            By {mainNews.writer} – {mainNews.date}
          </Text>
        </VStack>

        {/* Divider */}
        <Box minHeight={mainNews.imageHeight || "700px"} borderLeft="2px solid black" mx={2} />

        {/* Right: 2개 작은 뉴스 */}
        <VStack align="start" spacing={12} flex="1">
          {sideNews.map((news) => (
            <VStack key={news.id} spacing={2} align="start">
              <Image
                src={news.image}
                alt={news.title}
                width={news.imageWidth || "360px"}
                height={news.imageHeight || "200px"}
                objectFit="cover"
                borderRadius="md"
              />
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                NEWS
              </Text>
              <ChakraLink
                as={RouterLink}
                to={news.to}
                fontWeight="semibold"
                fontSize="md"
                _hover={{ textDecoration: "underline", color: "black" }}
              >
                {news.title}
              </ChakraLink>
              <Text fontSize="sm" color="gray.600">
                {news.date}
              </Text>
            </VStack>
          ))}
        </VStack>
      </HStack>

      {/* Divider */}
      <Divider borderColor="gray.300" />

      {/* 하단: 나머지 뉴스 카드 */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {restNews.map((news) => (
          <VStack key={news.id} spacing={3} align="start">
            <Image src={news.image} alt={news.title} width="100%" height="250px" objectFit="cover" borderRadius="md" />
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              NEWS
            </Text>
            <ChakraLink
              as={RouterLink}
              to={news.to}
              fontWeight="semibold"
              fontSize="lg"
              _hover={{ textDecoration: "underline", color: "black" }}
            >
              {news.title}
            </ChakraLink>
            <Text fontSize="sm" color="gray.500">
              {news.date}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default NoticeTable;
