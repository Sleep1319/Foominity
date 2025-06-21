import { Box, Text, Heading, HStack, Icon, useColorModeValue, Textarea } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import DefaultTable from "../../components/reportComponents/DefaultTable.jsx";
import PopularPosts from "@/components/homeComponents/PopularPosts.jsx";

const ReportDetail = () => {
  const navigate = useNavigate();

  const isLoggedIn = false;

  return (
    <Box display="flex" justifyContent="center" px={6} py={10}>
      <Box flex="1" maxW="900px" pr={{ base: 0, lg: 10 }}>
        <Text fontSize="2xl" fontWeight="medium" pb={2} textAlign="left">
          Report
        </Text>
        <Heading as="h1" size="2xl" textAlign="left" pb={2}>
          제목
        </Heading>
        <Box
          display="flex"
          textAlign="left"
          fontSize="lg"
          fontWeight="light"
          mt={2}
          borderBottom="2px solid gray"
          pb={4}
        >
          <Text pr={4}>writer</Text>
          <Text px={4}>date</Text>
          <Text px={4}>commentCount</Text>
        </Box>

        <Box mt={18}>
          <Text fontSize="md" whiteSpace="pre-wrap" textAlign="left" borderBottom="2px solid gray" pb={4}>
            TextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextText
            {"\n"}
            TextTextTextTextTextText
          </Text>
        </Box>

        <Text
          fontSize="md"
          textAlign="left"
          mt={6}
          mb={6}
          display="inline-block"
          cursor="pointer"
          onClick={() => navigate("/report")}
        >
          목록
        </Text>

        <HStack mt={4} spacing={1} borderBottom="2px solid gray" pb={4}>
          <Icon as={FaRegComment} boxSize={5} color={useColorModeValue("gray.700", "white")} />
          <Text fontSize="lg" color={useColorModeValue("gray.700", "white")}>
            댓글
          </Text>
          <Text fontSize="lg" color="blue.400">
            commentCount
          </Text>
        </HStack>

        <Box mt={4} borderBottom="2px solid gray" pb={14}>
          <Text fontWeight="bold" mb={2}>
            댓글 달기
          </Text>
          {isLoggedIn ? (
            <Textarea placeholder="댓글을 입력하세요..." />
          ) : (
            <Box
              p={8}
              border="1px solid gray"
              borderRadius="md"
              color="gray.600"
              whiteSpace="pre-wrap"
              minHeight="100px"
              cursor="pointer"
              onClick={() => navigate("/login")}
            >
              댓글 쓰기 권한이 없습니다. 로그인 하시겠습니까?
            </Box>
          )}
        </Box>

        <DefaultTable />
      </Box>

      <Box display={{ base: "none", lg: "block" }} position="sticky" top="100px" width="250px" alignSelf="flex-start">
        <PopularPosts />
      </Box>
    </Box>
  );
};

export default ReportDetail;
