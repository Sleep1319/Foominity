import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Flex,
  Icon,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa";
import { SearchIcon } from "@chakra-ui/icons";
import { useUser } from "../../context/UserContext";

const BOARDS_PER_PAGE = 7;
const CATEGORY_LIST = ["전체", "일반", "음악", "후기", "정보", "질문"];

const BoardList = ({ currentId }) => {
  //  "카테고리+검색" 동시 필터를 위한 state 통합
  const [boardList, setBoardList] = useState([]); // 게시글 목록 (카테고리/검색 결과)
  const [currentPage, setCurrentPage] = useState(1);

  //  탭(카테고리) 상태
  const [selectedCategory, setSelectedCategory] = useState("전체");

  //  검색 관련 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 입력중
  const [submittedKeyword, setSubmittedKeyword] = useState(""); // 실제 검색 실행(Submit) 시

  const navigate = useNavigate();
  const { state: user } = useUser();

  //  탭/검색어 중 하나라도 바뀌면 게시글 목록 새로 불러옴
  useEffect(() => {
    const fetchBoards = async () => {
      let params = {};
      if (selectedCategory !== "전체") params.category = selectedCategory; // 선택된 카테고리(전체 제외)
      if (submittedKeyword.trim() !== "") params.keyword = submittedKeyword; // 검색어
      // → 둘 다 없으면 전체, 하나만 있으면 단독, 둘 다 있으면 동시 필터
      const res = await axios.get("/api/board/page", { params });
      setBoardList(res.data.content || []);
      setCurrentPage(1); // 필터 바뀌면 항상 1페이지로 이동
    };
    fetchBoards();
  }, [selectedCategory, submittedKeyword]);

  // 페이지네이션 계산 (항상 boardList 기준!)
  const totalPages = Math.ceil(boardList.length / BOARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOARDS_PER_PAGE;
  const currentBoards = boardList.slice(startIndex, startIndex + BOARDS_PER_PAGE);

  // 페이지 블록 계산
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
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    if (isToday) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } else {
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    }
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      {/* 카테고리 탭: 선택 시 selectedCategory 변경 */}
      <Tabs variant="unstyled" onChange={(idx) => setSelectedCategory(CATEGORY_LIST[idx])}>
        <TabList>
          {CATEGORY_LIST.map((cat) => (
            <Tab
              key={cat}
              _selected={{
                color: "black",
                fontWeight: "bold",
                borderBottom: "2px solid black", // 선택된 탭 표시선
              }}
              fontWeight="normal" // 기본 탭은 얇게
              color="gray.700" // 기본 탭은 회색
              px={4}
              py={2}
            >
              {cat}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {/* 표 헤더 */}
      <Flex mt={3} px={4} py={2} fontWeight="semibold" fontSize="sm" color="gray.800" borderBottom="1px solid #e2e8f0">
        <Flex w="100%">
          <Box display="flex">
            <Text minW="40px" mr={3} textAlign="left" ml={7}>
              탭
            </Text>
            <Text minW="50px" textAlign="left">
              번호
            </Text>
          </Box>
          <Box flex="1" display="flex" justifyContent="center">
            <Text textAlign="center">제목</Text>
          </Box>
        </Flex>
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
      </Flex>

      {/* 게시글 목록 */}
      <SimpleGrid spacing={0} columns={{ base: 1, md: 1, lg: 1 }}>
        {currentBoards.map((board) => (
          <Card
            key={board.id}
            borderRadius="none"
            shadow="none"
            _hover={{ shadow: "none" }}
            borderBottom="1px solid #e2e8f0"
            mb={0}
          >
            <CardBody p={0}>
              <Flex align="center" minH="64px" px={4}>
                <Text ml={5}>{board.category}</Text>
                <Text w="80px" color="gray.400" fontSize="sm" textAlign="center">
                  {board.id}
                </Text>
                <Text
                  flex="1"
                  fontWeight="normal"
                  fontSize="lg"
                  color="inherit"
                  bg="none"
                  cursor="pointer"
                  onClick={() => navigate(`/board/${board.id}`)}
                  _hover={{
                    color: "black",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                  noOfLines={2}
                  ml={2}
                >
                  {board.title}
                </Text>

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
        {blockStart > 1 && (
          <Button size="sm" variant="outline" onClick={() => setCurrentPage(blockStart - 1)}>
            이전
          </Button>
        )}
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
        {blockEnd < totalPages && (
          <Button size="sm" variant="outline" onClick={() => setCurrentPage(blockEnd + 1)}>
            다음
          </Button>
        )}
      </HStack>

      {/* 🔵 제목 검색: 입력 후 엔터/버튼으로 submittedKeyword를 변경 */}
      <Box mt={8}>
        <Flex gap={4} align="center">
          <Text mb={2} fontWeight="bold" whiteSpace="nowrap">
            제목으로 검색
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmittedKeyword(searchKeyword); // 실제 검색 실행!
            }}
            style={{ flex: 1 }}
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
