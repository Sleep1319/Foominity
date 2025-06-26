import React from "react";
import { Box, Text } from "@chakra-ui/react";
import NoticeList from "../../components/noticeComponents/NoticeList.jsx";

const NoticeLists = () => {
  return (
    <div>
      <Box p={6}>
        <Text fontSize="3xl" fontWeight="medium" pb={2} textAlign="center">
          Notice
        </Text>
        <NoticeList />
        

      </Box>
    </div>
  );
};

export default NoticeLists;
