// src/pages/ReportList.jsx
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
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@/redux/useUser.js";
import RpeortSearchBar from "./ReportSearchBar";

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

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [keyword, setKeyword] = useState(""); // 🔍 제목/작성자 검색어
  const navigate = useNavigate();
  const { state: user } = useUser();

  function formatDate(dateString) {
    if (!dateString) return "-";
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
    }
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }

  // 페이지 복원
  useEffect(() => {
    const savedPage = sessionStorage.getItem("reportListPage");
    if (savedPage !== null) {
      setPage(Number(savedPage));
      sessionStorage.removeItem("reportListPage");
    }
  }, []);

  // 목록 조회 (서버에 keyword 파라미터 전달)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          size: String(pageSize),
        });
        if (keyword && keyword.trim().length > 0) {
          params.set("keyword", keyword.trim()); // ⚠️ 백엔드 파라미터명 맞춰 변경 가능
        }
        const res = await axios.get(`/api/report/page?${params.toString()}`);
        const { content, totalPages, totalElements, size } = res.data;
        setReports(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
        setPageSize(size);
      } catch (err) {
        console.error("리포트 목록 조회 실패:", err);
      }
    };
    fetchReports();
  }, [page, pageSize, keyword]);

  // 스크롤 위치 복원
  useEffect(() => {
    if (reports.length > 0) {
      const savedY = sessionStorage.getItem("reportScrollY");
      if (savedY) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedY, 10));
          sessionStorage.removeItem("reportScrollY");
        }, 0);
      }
    }
  }, [reports, page]);

  const handleReportClick = (reportId) => {
    sessionStorage.setItem("reportScrollY", window.scrollY);
    sessionStorage.setItem("reportListPage", page);
    navigate(`/report/${reportId}`);
  };

  const canWrite = user && ["BRONZE", "SILVER", "GOLD"].includes(user.roleName);

  // 클라이언트 보정 필터(유형/상태/제목/작성자)
  const filteredReports = reports.filter((report) => {
    const typeMatch = filterType === "ALL" || report.type === filterType;
    const statusMatch = filterStatus === "ALL" || report.status === filterStatus;
    const kw = keyword.trim().toLowerCase();
    const keywordMatch =
      kw.length === 0 ||
      (report.title && report.title.toLowerCase().includes(kw)) ||
      (report.nickname && report.nickname.toLowerCase().includes(kw));
    return typeMatch && statusMatch && keywordMatch;
  });

  // 페이지네이션: 클라 필터로 줄어든 경우 1페이지만 표시(버튼은 활성)
  const isLocalFilterActive =
    filterType !== "ALL" ||
    filterStatus !== "ALL" ||
    (keyword.trim().length > 0 && filteredReports.length !== reports.length);
  const displayTotalPages = isLocalFilterActive ? 1 : Math.max(1, totalPages);

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={2}>
      {/* 상단: 유형/상태 필터 + (작성 버튼) */}
      <Flex justify="space-between" mb={4} align="center">
        <HStack spacing={3}>
          {/* 유형 필터 */}
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
              {typeFilterOptions.find((opt) => opt.value === filterType)?.label || "전체"}
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

          {/* 처리 상태 필터 */}
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
              {statusFilterOptions.find((opt) => opt.value === filterStatus)?.label || "전체"}
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

        {canWrite && (
          <Button
            color="white"
            bg="black"
            size="sm"
            fontSize="sm"
            _hover={{ bg: "gray.800" }}
            onClick={() => navigate("/report/create")}
          >
            글 작성
          </Button>
        )}
      </Flex>

      {/* 리스트 테이블 */}
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
          </Tr>
        </Thead>
        <Tbody>
          {filteredReports.map((report, index) => (
            <Tr
              key={report.id}
              style={{ cursor: "pointer" }}
              height="40px"
              onClick={() => handleReportClick(report.id)}
            >
              <Td>
                {/* 인덱스(번호) 로직은 그대로 */}
                {(keyword && keyword.trim().length > 0) || filterType !== "ALL" || filterStatus !== "ALL"
                  ? filteredReports.length - index
                  : totalElements - page * pageSize - index}
              </Td>
              <Td>{getTypeBadge(report.type)}</Td>
              <Td className="title-cell" fontWeight="bold">
                {report.title}
              </Td>
              <Td>{report.nickname}</Td>
              <Td>{getStatusLabel(report.status)}</Td>
              <Td>{formatDate(report.createdDate)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* 하단: 검색바(오른쪽) */}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <RpeortSearchBar
          defaultValue={keyword}
          onSearch={(kw) => {
            setPage(0); // 검색 시 첫 페이지로
            setKeyword(kw);
          }}
          width="280px"
        />
      </Box>

      {/* 페이지네이션: 항상 활성(회색 비활성 X) */}
      <HStack spacing={2} justify="center" mt={8}>
        <Button
          size="sm"
          bg="white"
          color="black"
          border="1px solid black"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
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
          onClick={() => setPage((prev) => Math.min(prev + 1, displayTotalPages - 1))}
        >
          다음
        </Button>
      </HStack>
    </Box>
  );
};

export default ReportList;
