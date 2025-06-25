import React from "react";
import { Box, Text } from "@chakra-ui/react";
import ReviewTable from "../../components/reviewComponents/ReviewTable.jsx";

const Review = () => {
  return (
    <Box p={6}>
      <Text fontSize="3xl" fontWeight="medium" pb={2} textAlign="center">
        Review
      </Text>
      <ReviewTable />
    </Box>
  );
};

export default Review;
