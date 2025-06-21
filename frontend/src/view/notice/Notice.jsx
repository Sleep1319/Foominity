import React from "react";
import { Box, Text } from "@chakra-ui/react";
import NoticeTable from "../../components/noticeComponents/NoticeTable.jsx";

const Notice = () => {
  return (
    <div>
      <Box p={6}>
        <Text fontSize="3xl" fontWeight="medium" borderBottom="2px solid gray" pb={2}>
          Notice📌
        </Text>
        <NoticeTable />
      </Box>
    </div>
  );
};

export default Notice;
