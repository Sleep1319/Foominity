import React from "react";
import { Box, Input, IconButton, Portal } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const SearchNavbar = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <Portal>
      {/* 오버레이: 화면 전체 어둡게 + 클릭 시 닫힘 */}
      <Box position="fixed" top="0" left="0" w="100vw" h="100vh" bg="blackAlpha.700" zIndex="10000" onClick={onClose} />

      {/* 상단 고정 검색바 */}
      <Box position="fixed" top="0" left="0" w="100%" bg="black" px={8} py={6} zIndex="10001">
        <Box position="relative" maxW="500px" mx="auto">
          <Input
            placeholder="Search..."
            w="100%"
            bg="white"
            color="black"
            borderColor="black"
            borderWidth="1px"
            borderRadius="md"
            pr="3rem"
            _focus={{ boxShadow: "none", borderColor: "black" }}
          />
          <IconButton
            aria-label="Close Search"
            icon={<CloseIcon />}
            variant="ghost"
            color="black"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            right="8px"
            size="sm"
            zIndex="10002"
            _hover={{ bg: "transparent" }}
            onClick={onClose}
          />
        </Box>
      </Box>
    </Portal>
  );
};

export default SearchNavbar;
