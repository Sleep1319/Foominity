import { Box, HStack, Heading, Button, IconButton, Spacer } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";

const AppNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconElement = colorMode === "light" ? <MoonIcon /> : <SunIcon />;

  return (
    <Box
      as="header"
      px={6}
      py={4}
      borderBottom="1px solid #eee"
      position="sticky"
      top="0"
      bg={colorMode === "light" ? "white" : "gray.800"}
      zIndex="1000"
    >
      <HStack>
        <Heading as={RouterLink} to="/home" size="md">
          FOOMINITY
        </Heading>

        <Spacer />

        {/* 네비 메뉴 버튼 */}
        <Button as={RouterLink} to="/review" variant="ghost">
          Review
        </Button>
        <Button as={RouterLink} to="/freeboard" variant="ghost">
          FreeBoard
        </Button>
        <Button as={RouterLink} to="/notice" variant="ghost">
          Notice
        </Button>
        <Button as={RouterLink} to="/report" variant="ghost">
          Report
        </Button>

        <Spacer />

        {/* 로그인, 회원가입 버튼 */}
        <Button as={RouterLink} to="/login" variant="ghost">
          로그인
        </Button>
        <Button as={RouterLink} to="/register" colorScheme="teal">
          회원가입
        </Button>

        {/* 다크모드 토글 */}
        <IconButton icon={iconElement} onClick={toggleColorMode} aria-label="Toggle color mode" />
      </HStack>
    </Box>
  );
};

export default AppNavbar;
