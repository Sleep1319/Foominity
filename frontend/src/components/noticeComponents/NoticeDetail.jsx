import { Box, Text, Heading, HStack, Icon, Textarea } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultTable from "../../components/reportComponents/DefaultTable.jsx";
import PopularPosts from "@/components/homeComponents/PopularPosts.jsx";

const NoticeDetail = () => {
  const navigate = useNavigate();
  // const isLoggedIn = false;

  return (
    <Box display="flex" justifyContent="center" px={6} py={10}>
      <Box flex="1" maxW="900px" pr={{ base: 0, lg: 10 }}>
        <Text fontSize="2xl" fontWeight="medium" pb={2} textAlign="left">
          Notice
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

        <DefaultTable />
      </Box>

      <Box display={{ base: "none", lg: "block" }} position="sticky" top="100px" width="250px" alignSelf="flex-start">
        <PopularPosts />
      </Box>
    </Box>
  );
};

export default NoticeDetail;
