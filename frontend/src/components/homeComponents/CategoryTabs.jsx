import { Box, Button, HStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";

const CategoryTabs = () => (
  <Box mb={8}>
    <HStack spacing={4}>
      <Button
        as={RouterLink}
        to="/review"
        bg="white"
        color="black"
        _hover={{ bg: "white" }} // ✅ hover 시 색 유지
      >
        Review
      </Button>
      <Button as={RouterLink} to="/board" bg="white" color="black" _hover={{ bg: "white" }}>
        Board
      </Button>
      <Button as={RouterLink} to="/notice" bg="white" color="black" _hover={{ bg: "white" }}>
        Notice
      </Button>
      <Button as={RouterLink} to="/report" bg="white" color="black" _hover={{ bg: "white" }}>
        Report
      </Button>
    </HStack>
  </Box>
);

export default CategoryTabs;
