import React from "react";
import { Box, Text } from "@chakra-ui/react";
import ReviewTable from "../../components/reviewComponents/ReviewTable.jsx";

const Review = () => {
  return (
    <Box p={6}>
      <Text fontSize="3xl" fontWeight="medium" borderBottom="2px solid gray" pb={2}>
        🍔🍖Review🍱🍜
      </Text>
      <ReviewTable />
    </Box>
  );
};

export default Review;
