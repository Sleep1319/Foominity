import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`/api/report/page?page=${page}`);
        setReports(res.data.content); // Page<T> 구조에 맞게
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("리포트 목록 조회 실패:", err);
      }
    };
    fetchReports();
  }, [page]);

  return (
    <Box p={6} maxW="1000px" mx="auto">
      

      <SimpleGrid spacing={4}>
        {reports.map((report) => (
          <Card
            key={report.id}
            borderRadius="lg"
            _hover={{ shadow: "md", cursor: "pointer" }}
            onClick={() => navigate(`/report/${report.id}`)}
          >
            <CardBody>
              <Text fontSize="md" color="gray.500">
                대상 ID: {report.targetId}
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                대상 타입: {report.targetType}
              </Text>
              <Text fontSize="sm" color="gray.400" mt={1}>
                작성자 ID: {report.memberId}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* 페이지네이션 */}
      <HStack spacing={2} justify="center" mt={8}>
        <Button
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          isDisabled={page === 0}
        >
          이전
        </Button>

        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            size="sm"
            variant={i === page ? "solid" : "outline"}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          size="sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          isDisabled={page >= totalPages - 1}
        >
          다음
        </Button>
      </HStack>
    </Box>
  );
};

export default ReportList;
