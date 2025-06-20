import React, { useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa";
import { SearchIcon } from "@chakra-ui/icons";

// 임시로 const 정의

const filteredPosts = [
  {
    id: 1,
    title: "첫 번째 게시글입니다.",
    author: "홍길동",
    createdAt: "2025-06-18",
    views: 123,
  },
  {
    id: 2,
    title: "두 번째 게시글 입니다.",
    author: "성춘향",
    createdAt: "2025-06-17",
    views: 99,
  },
  {
    id: 3,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-16",
    views: 75,
  },
  {
    id: 4,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-15",
    views: 75,
  },
  {
    id: 5,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-15",
    views: 75,
  },
  {
    id: 6,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-15",
    views: 75,
  },
  {
    id: 7,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-15",
    views: 75,
  },
  {
    id: 8,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-15",
    views: 75,
  },
  {
    id: 9,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-15",
    views: 75,
  },
  {
    id: 10,
    title: "음식 이야기 입니다.",
    author: "김유환",
    createdAt: "2025-06-15",
    views: 75,
  },
];

// 페이지 갯수
const POSTS_PER_PAGE = 7;

const FreeBoardList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const [searchKeyword, setSearchKeyword] = useState("");
  return (
    <Box p={6} maxW="1200px" mx="auto">
      {/* 헤딩과 검색어 영역 */}
      <Flex align="center" justify="space-between" mb={6}>
        <Heading as="h2" size="xl">
          자유게시판
        </Heading>
        {/* 
        <Menu isLazy>
          <MenuButton as={Button} size="sm">
            카테고리
          </MenuButton>
          <MenuList>
            <MenuItem>한식</MenuItem>
            <MenuItem>중식</MenuItem>
            <MenuItem>일식</MenuItem>
          </MenuList>
        </Menu> */}
      </Flex>
      {/* 📌 이 부분이 헤더 라인입니다 */}
      <Flex px={4} py={2} fontWeight="semibold" fontSize="sm" color="gray.600" borderBottom="1px solid #e2e8f0">
        <Text flex="1">제목</Text>

        <Flex gap={6} minW="300px" justify="flex-end">
          <Text w="80px" textAlign="center">
            글쓴이
          </Text>
          <Text w="80px" textAlign="center">
            날짜
          </Text>
          <Text w="60px" textAlign="center">
            조회수
          </Text>
        </Flex>
        {/* 검색어 + 메뉴 */}
      </Flex>

      {/* 게시글 목록을 그리드 형태로 표시 */}
      <SimpleGrid spacing={4} columns={{ base: 1, md: 1, lg: 1 }}>
        {currentPosts.map((post) => (
          <Card key={post.id} borderRadius="lg" shadow="md" _hover={{ shadow: "lg" }}>
            <CardBody>
              <Flex gap={1} align="center">
                {/* 게시글 제목 */}
                <Text fontWeight="bold" fontSize="lg" noOfLines={2} flex="1" minWidth="0">
                  {post.title}
                </Text>

                {/* 오른쪽 영역 - 작성자, 날짜, 조회수 */}
                <Flex align="center" gap={10} ml="auto" flexShrink={0} w={"60"}>
                  <Flex fontSize="sm" color="gray.500" gap={12} align="center">
                    <Text>{post.author}</Text>
                    <Text>{post.createdAt}</Text>
                  </Flex>

                  <Flex align="center" gap={1} fontSize="sm" color="gray.500">
                    <Icon as={FaRegEye} />
                    <Text>{post.views}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* 페이지네이션 */}
      <HStack spacing={2} justify="center" mt={8}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            size="sm"
            variant={currentPage === i + 1 ? "solid" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </HStack>

      {/* 제목 검색 */}
      <Box mt={8}>
        <Flex gap={10}>
          <Text mb={2} fontWeight="bold">
            제목으로 검색
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
          >
            <InputGroup maxW="400px">
              <Input
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <InputRightElement>
                <Button type="submit" size="sm" variant="ghost">
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
        </Flex>
      </Box>
    </Box>
  );
};

export default FreeBoardList;
