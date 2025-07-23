import React, { useState } from "react";
import { Box, HStack, Spacer, Image, IconButton, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

import logoImage from "@/assets/images/doremiSOL_logo2.png";
import { useUser } from "@/context/UserContext";
import AuthButtons from "@/components/navComponents/AuthButtons.jsx";
import UserSection from "@/components/navComponents/UserSection.jsx";
import SearchNavbar from "@/components/navComponents/SearchNavbar.jsx";

const AppNavbar = () => {
  const { state } = useUser();
  const [isSearchVisible, setSearchVisible] = useState(false);
  const toggleSearch = () => setSearchVisible((prev) => !prev);

  return (
    <Box
      as="header"
      px={6}
      py={1}
      position="fixed"
      top="0"
      left="0"
      w="100%"
      bg="whiteAlpha.200"
      backdropFilter="blur(80px)"
      zIndex="9999"
    >
      {/* Search Navbar (검색창 토글) */}
      <SearchNavbar isVisible={isSearchVisible} onClose={() => setSearchVisible(false)} />

      <HStack align="center" spacing={4}>
        {/* 로고 */}
        <Box as={RouterLink} to="/">
          <Image src={logoImage} alt="doremiSOL Logo" boxSize="72px" objectFit="contain" />
        </Box>

        <Spacer />

        {/* 카테고리 (중앙) */}
        <HStack spacing={4}>
          <Button as={RouterLink} to="/review" variant="ghost" color="black" _hover={{ bg: "transparent" }}>
            Review
          </Button>
          <Button as={RouterLink} to="/board" variant="ghost" color="black" _hover={{ bg: "transparent" }}>
            Board
          </Button>
          <Button as={RouterLink} to="/notice" variant="ghost" color="black" _hover={{ bg: "transparent" }}>
            Notice
          </Button>
          <Button as={RouterLink} to="/report" variant="ghost" color="black" _hover={{ bg: "transparent" }}>
            Report
          </Button>
        </HStack>

        <Spacer />

        {/* [항상 보임!] 검색 아이콘 + 로그인/유저 */}
        <IconButton
          aria-label="Toggle Search"
          icon={<SearchIcon />}
          variant="ghost"
          bg="transparent"
          _hover={{ bg: "transparent" }}
          onClick={toggleSearch}
        />
        {state && state.nickname ? <UserSection /> : <AuthButtons />}
      </HStack>
    </Box>
  );
};

export default AppNavbar;
