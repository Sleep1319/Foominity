import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Badge,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon, SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReportStatusControl from "./ReportStatusControl.jsx";

const getTypeBadge = (type) => {
  switch (type) {
    case "REPORT":
      return <Badge colorScheme="red">신고</Badge>;
    case "INQUIRY":
      return <Badge colorScheme="blue">문의</Badge>;
    case "REQUEST":
      return <Badge colorScheme="purple">요청</Badge>;
    case "SUGGESTION":
      return <Badge colorScheme="green">건의</Badge>;
    default:
      return <Badge>기타</Badge>;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "대기 중";
    case "IN_PROGRESS":
      return "처리 중";
    case "RESOLVED":
      return "처리 완료";
    case "REJECTED":
      return "거절됨";
    default:
      return "알수없음";
  }
};

const typeFilterOptions = [
  { value: "ALL", label: "전체" },
  { value: "REPORT", label: "신고" },
  { value: "INQUIRY", label: "문의" },
  { value: "REQUEST", label: "요청" },
  { value: "SUGGESTION", label: "건의" },
];

const statusFilterOptions = [
  { value: "ALL", label: "전체" },
  { value: "PENDING", label: "대기 중" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "RESOLVED", label: "처리 완료" },
  { value: "REJECTED", label: "거절됨" },
];

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const n = new Date();
  const today = d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  if (today) {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export default function AdminPageList() {
  const navigate = useNavigate();

  // 서버 페이징 & 검색
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // 필터/검색
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  // 읽은 글 ID (문자열 Set)
  const [readIds, setReadIds] = useState(() => {
    try {
      const raw = localStorage.getItem("admin_read_report_ids");
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr.map(String) : []);
    } catch {
      return new Set();
    }
  });
  const markAsRead = (id) => {
    const key = String(id);
    setReadIds((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      localStorage.setItem("admin_read_report_ids", JSON.stringify([...next]));
      return next;
    });
  };

  // 목록 조회
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const params = new URLSearchParams({ page: String(page), size: String(pageSize) });
        if (keyword.trim()) params.set("keyword", keyword.trim());
        const res = await axios.get(`/api/report/page?${params.toString()}`, { withCredentials: true });
        const { content, totalPages, totalElements, size } = res.data;
        setReports(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
        setPageSize(size);
      } catch (e) {
        console.error("리포트 목록 조회 실패:", e);
      }
    };
    fetchReports();
  }, [page, pageSize, keyword]);

  // 필터링
  const filteredReports = reports.filter((r) => {
    const typeOk = filterType === "ALL" || r.type === filterType;
    const statusOk = filterStatus === "ALL" || r.status === filterStatus;
    const kw = keyword.trim().toLowerCase();
    const kwOk =
      !kw || (r.title && r.title.toLowerCase().includes(kw)) || (r.nickname && r.nickname.toLowerCase().includes(kw));
    return typeOk && statusOk && kwOk;
  });

  const localFilter =
    filterType !== "ALL" ||
    filterStatus !== "ALL" ||
    (keyword.trim().length > 0 && filteredReports.length !== reports.length);
  const displayTotalPages = localFilter ? 1 : Math.max(1, totalPages);

  // 검색바
  const [searchInput, setSearchInput] = useState(keyword);
  const submitSearch = (e) => {
    e?.preventDefault?.();
    setPage(0);
    setKeyword(searchInput);
  };
  const clearSearch = () => {
    setSearchInput("");
    setKeyword("");
    setPage(0);
  };

  // 제목 클릭 → 읽음 표시 + 상세 진입 (admin origin 표시)
  const openReport = (id) => {
    markAsRead(id);
    navigate(`/report/${id}?from=admin`, { state: { from: "admin" } });
  };

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={2}>
    
      <Flex justify="space-between" mb={4} align="center">
        <HStack spacing={3}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              size="sm"
              color={filterType === "ALL" ? "black" : "white"}
              bg={filterType === "ALL" ? "white" : "black"}
              borderRadius="md"
              border="1px solid black"
              fontWeight="medium"
              px={4}
              _hover={{ bg: filterType === "ALL" ? "gray.100" : "gray.800" }}
              _active={{ bg: filterType === "ALL" ? "gray.200" : "gray.900" }}
            >
              {typeFilterOptions.find((o) => o.value === filterType)?.label || "전체"}
            </MenuButton>
            <MenuList>
              {typeFilterOptions.map(({ value, label }) => (
                <MenuItem
                  key={value}
                  onClick={() => setFilterType(value)}
                  fontWeight={filterType === value ? "bold" : "normal"}
                  icon={filterType === value ? <CheckIcon color="black" /> : null}
                  _hover={{ bg: "gray.100" }}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              size="sm"
              color={filterStatus === "ALL" ? "black" : "white"}
              bg={filterStatus === "ALL" ? "white" : "black"}
              borderRadius="md"
              border="1px solid black"
              fontWeight="medium"
              px={4}
              _hover={{ bg: filterStatus === "ALL" ? "gray.100" : "gray.800" }}
              _active={{ bg: filterStatus === "ALL" ? "gray.200" : "gray.900" }}
            >
              {statusFilterOptions.find((o) => o.value === filterStatus)?.label || "전체"}
            </MenuButton>
            <MenuList>
              {statusFilterOptions.map(({ value, label }) => (
                <MenuItem
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  fontWeight={filterStatus === value ? "bold" : "normal"}
                  icon={filterStatus === value ? <CheckIcon color="black" /> : null}
                  _hover={{ bg: "gray.100" }}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* 목록 */}
      <Table
        variant="simple"
        size="sm"
        tableLayout="fixed"
        sx={{
          th: { textAlign: "center" },
          td: { textAlign: "center", verticalAlign: "middle" },
          ".title-cell": {
            maxWidth: "180px",
            minWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      >
        <Thead>
          <Tr>
            <Th width="60px">NO</Th>
            <Th width="80px">유형</Th>
            <Th className="title-cell" width="180px">
              제목
            </Th>
            <Th width="90px">작성자</Th>
            <Th width="90px">처리 상태</Th>
            <Th width="110px">작성일</Th>
            <Th width="110px">변경</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredReports.map((r, idx) => {
            const isRead = readIds.has(String(r.id));
            return (
              <Tr key={r.id} height="40px">
                <Td>
                  {keyword.trim() || filterType !== "ALL" || filterStatus !== "ALL"
                    ? filteredReports.length - idx
                    : totalElements - page * pageSize - idx}
                </Td>
                <Td>{getTypeBadge(r.type)}</Td>
                <Td className="title-cell">
                  <Text
                    onClick={() => openReport(r.id)}
                    sx={{
                      cursor: "pointer",
                      color: isRead ? "black" : "blue.600",
                      fontWeight: isRead ? "normal" : "bold",
                      textDecoration: "none",
                      _hover: { textDecoration: "underline", color: isRead ? "black" : "blue.700" },
                    }}
                  >
                    {r.title}
                  </Text>
                </Td>
                <Td>{r.nickname}</Td>
                <Td>{getStatusLabel(r.status)}</Td>
                <Td>{formatDate(r.createdDate)}</Td>
                <Td>
                  <ReportStatusControl
                    reportId={r.id}
                    value={r.status}
                    onChanged={(next) =>
                      setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: next } : x)))
                    }
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {/* 검색바 */}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <form onSubmit={submitSearch} style={{ width: "320px" }}>
          <InputGroup>
            <Input
              placeholder="제목/작성자 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <InputRightElement width="5.5rem">
              <HStack spacing={1}>
                {searchInput && <CloseButton size="sm" onClick={clearSearch} title="검색어 지우기" />}
                <Button type="submit" size="sm" variant="ghost">
                  <SearchIcon />
                </Button>
              </HStack>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>

      {/* 페이지네이션 */}
      <HStack spacing={2} justify="center" mt={8}>
        <Button
          size="sm"
          bg="white"
          color="black"
          border="1px solid black"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          이전
        </Button>
        {[...Array(displayTotalPages)].map((_, i) => (
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
          onClick={() => setPage((p) => Math.min(p + 1, displayTotalPages - 1))}
        >
          다음
        </Button>
      </HStack>
    </Box>
  );
}
