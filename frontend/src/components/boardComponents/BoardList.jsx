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
        <Heading as="h2" size="xl" cursor="pointer" onClick={() => navigate("/board")}>
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
      <Flex px={4} py={2} fontWeight="semibold" fontSize="sm" color="gray.600" borderBottom="1px solid #e2e8f0">
        <Text flex="1">번호</Text>

        <Text flex="1">제목</Text>

        <Flex minW="300px" justify="space-between">
          <Text w="130px" textAlign="center">
            글쓴이
          </Text>
          <Text w="70px" textAlign="center" pr={4}>
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
          <Card key={board.id} borderRadius="lg" shadow="md" _hover={{ shadow: "lg" }} mb={2}>
            <CardBody p={0}>
              <Flex align="center" minH="64px" px={4}>
                {/* 번호 */}
                <Text w="80px" color="gray.400" fontSize="sm" textAlign="center">
                  {board.id}
                </Text>
                {/* 게시글 제목 */}
                <Text
                  flex="1"
                  fontWeight="bold"
                  fontSize="lg"
                  cursor="pointer"
                  onClick={() => navigate(`/board/${board.id}`)}
                  _hover={{ color: "blue.500", textDecoration: "underline" }}
                  noOfLines={2}
                  ml={2}
                >
                  {board.title}
                </Text>
                {/* 오른쪽 영역: 글쓴이, 날짜, 조회수 */}
                <Flex gap={6} minW="320px" justify="flex-end" align="center" ml={4}>
                  <Text w="100px" textAlign="center" color="gray.500" fontSize="sm">
                    {board.nickname}
                  </Text>
                  <Text w="80px" textAlign="center" color="gray.500" fontSize="sm">
                    {formatDate(board.createdDate)}
                  </Text>
                  <Flex w="60px" align="center" justify="center" color="gray.500" fontSize="sm" gap={1}>
                    <Icon as={FaRegEye} />
                    <Text>{(board.views / 2).toFixed(0)}</Text>
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
