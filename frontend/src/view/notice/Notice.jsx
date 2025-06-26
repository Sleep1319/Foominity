import React from "react";
import { Box, Text } from "@chakra-ui/react";
import NoticeTable from "../../components/noticeComponents/NoticeTable.jsx";

const Notice = () => {
  return (
    <div>
      <Box p={6}>
        <Text fontSize="3xl" fontWeight="medium" pb={2} textAlign="center">
          Notice
        </Text>
        <NoticeTable />
      </Box>
    </div>
  );
};

export default Notice;
