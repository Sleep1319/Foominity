import React from "react";
import { Box, Button, Input, Flex, HStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const SearchNavbar = ({ isVisible, onMouseEnter, onMouseLeave }) => {
  return (
    <>
      {/* 오버레이 */}
      {isVisible && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg="blackAlpha.700"
          zIndex="999"
          pointerEvents="none"
        />
      )}

      {/* 슬라이드 네브바 */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100%"
        bg="black"
        color="white"
        boxShadow="md"
        zIndex="1000"
        px={8}
        py={6}
        minH="100px"
        transform={isVisible ? "translateY(0)" : "translateY(-120%)"}
        transition="transform 0.3s ease"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Flex align="center" justify="space-between" w="100%">
          {/* 왼쪽 빈 공간 */}
          <Box w="300px" />

          {/* 버튼 그룹 */}
          <HStack spacing={6}>
            <Button as={RouterLink} to="/review" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
              Review
            </Button>
            <Button as={RouterLink} to="/board" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
              Board
            </Button>
            <Button as={RouterLink} to="/notice" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
              Notice
            </Button>
            <Button as={RouterLink} to="/report" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
              Report
            </Button>
          </HStack>

          {/* 검색창 */}
          <Input
            placeholder="Search..."
            maxW="300px"
            bg="white"
            color="black"
            zIndex="1001"
            position="relative"
            borderColor="black"
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ borderColor: "black" }}
            _focus={{ borderColor: "black", boxShadow: "none" }}
          />
        </Flex>
      </Box>
    </>
  );
};

export default SearchNavbar;
