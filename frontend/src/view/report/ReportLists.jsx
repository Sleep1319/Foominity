import React from "react";
import { Box, Text } from "@chakra-ui/react";

import ReportList from "../../components/reportComponents/ReportList.jsx";

const ReportLists = () => {
  return (
    <div>
      <Box p={6}>
        <Text fontSize="3xl" fontWeight="extrabold" pb={2} textAlign="center" mt={20}>
          Report
        </Text>
        <ReportList />
      </Box>
    </div>
  );
};

export default ReportLists;
