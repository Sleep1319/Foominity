import React from "react";
import { Box, Text } from "@chakra-ui/react";
import ReportTable from "../components/ReportTable";

const Report = () => {
  return (
    <Box p={6}>
      <Text fontSize="3xl" fontWeight="medium" borderBottom="2px solid gray" pb={2}>
        Report🚨
      </Text>
      <ReportTable />
    </Box>
  );
};

export default Report;
