import { Box } from "@chakra-ui/react";
import React from "react";

const ReportDetail = () => {
  return (
    <Box p={6}>
      <Text fontSize="1xl" fontWeight="medium" pb={2}>
        Report
      </Text>
      <Heading as="h1" size="2xl">
        제목
      </Heading>
      <Text></Text>
    </Box>
  );
};

export default ReportDetail;
