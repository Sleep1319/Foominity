import { Box, Text, Heading } from "@chakra-ui/react";
import React from "react";

const NoticeDetail = () => {
  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="medium" pb={2} textAlign="left">
        Report
      </Text>
      <Heading as="h1" size="2xl" textAlign="left">
        제목
      </Heading>
      <Box display="flex" textAlign="left" fontSize="lg" fontWeight="light" mt={2} borderBottom="2px solid gray" pb={3}>
        <Text pr={4}>writer</Text>
        <Text px={4}>date</Text>
        <Text px={4}>commentCount</Text>
      </Box>
    </Box>
  );
};

export default NoticeDetail;
