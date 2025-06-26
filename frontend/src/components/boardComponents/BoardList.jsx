import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Flex,
  Icon,
  // Menu,
  // MenuButton,
  // MenuList,
  // MenuItem,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa";
import { SearchIcon } from "@chakra-ui/icons";
import { useUser } from "../../context/UserContext";

// 페이지 갯수
const BOARDS_PER_PAGE = 7;

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");

  const navigate = useNavigate();

  // 게시글 가져오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("/api/board/search", {
          params: {
            keyword: submittedKeyword,
          },
        });
        setBoards(response.data);
        setCurrentPage(1);
      } catch (err) {
        console.error("검색 실패:", err);
      }
    };

    fetchBoards();
  }, [submittedKeyword]);

  // 페이징
  const totalPages = Math.ceil(boards.length / BOARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOARDS_PER_PAGE;
  const currentBoards = boards.slice(startIndex, startIndex + BOARDS_PER_PAGE);

  const PAGE_BLOCK = 10;
  const currentBlock = Math.floor((currentPage - 1) / PAGE_BLOCK);
  const blockStart = currentBlock * PAGE_BLOCK + 1;
  const blockEnd = Math.min(blockStart + PAGE_BLOCK - 1, totalPages);

  const pageNumbers = [];
  for (let i = blockStart; i <= blockEnd; i++) {
    pageNumbers.push(i);
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    // 오늘 여부 체크
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isToday) {
      // 시간, 분만 반환 (ex: 16:31)
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } else {
      // 날짜만 반환 (ex: 2025.6.24)
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    }
  }

  const { state: user, isLoading } = useUser();

  console.log(isLoading); // 경고 없애기용 (임시)

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
            <MenuItem>발라드</MenuItem>
            <MenuItem>트로트</MenuItem>
            <MenuItem>힙합</MenuItem>
            <MenuItem>록</MenuItem>
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
        {currentBoards.map((board) => (
          <Card key={board.id} borderRadius="lg" shadow="md" _hover={{ shadow: "lg" }}>
            <CardBody>
              <Flex gap={1} align="center">
                {/* 게시글 제목 */}
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  noOfLines={2}
                  flex="1"
                  minWidth="0"
                  cursor="pointer"
                  onClick={() => navigate(`/board/${board.id}`)}
                  _hover={{ color: "blue.500", textDecoration: "underline" }}
                >
                  {board.title}
                </Text>

                {/* 오른쪽 영역 - 작성자, 날짜, 조회수 */}
                <Flex align="center" gap={10} ml="auto" flexShrink={0} w={"60"}>
                  <Flex fontSize="sm" color="gray.500" gap={12} align="center">
                    <Text>{board.nickname}</Text>
                    <Text>{formatDate(board.createdDate)}</Text>
                  </Flex>

                  <Flex align="center" gap={1} fontSize="sm" color="gray.500">
                    <Icon as={FaRegEye} />
                    <Text>{board.views}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* 페이지네이션 */}
      <HStack spacing={2} justify="center" mt={8}>
        {/* 이전 블록 버튼 */}
        {blockStart > 1 && (
          <Button size="sm" variant="outline" onClick={() => setCurrentPage(blockStart - 1)}>
            이전
          </Button>
        )}

        {/* 실제 페이지 번호 버튼 */}
        {pageNumbers.map((num) => (
          <Button
            key={num}
            size="sm"
            variant={currentPage === num ? "solid" : "outline"}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </Button>
        ))}

        {/* 다음 블록 버튼 */}
        {blockEnd < totalPages && (
          <Button size="sm" variant="outline" onClick={() => setCurrentPage(blockEnd + 1)}>
            다음
          </Button>
        )}
      </HStack>

      {/* 제목 검색 */}
      <Box mt={8}>
        <Flex gap={4} align="center">
          <Text mb={2} fontWeight="bold" whiteSpace="nowrap">
            제목으로 검색
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmittedKeyword(searchKeyword); // 검색 실행
            }}
            style={{ flex: 1 }} // form도 옆으로 늘어나게
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
          {user && (
            <Button colorScheme="blue" size="sm" onClick={() => navigate("/board/create")} ml={2} px={6}>
              글쓰기
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default BoardList;
