import React, { useState } from "react";
import { Box, HStack, Spacer, Image, IconButton, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

import logoImage from "@/assets/images/doremiSOL_lp.png";
import {useUser} from "../redux/useUser.js";
import AuthButtons from "@/components/navComponents/AuthButtons.jsx";
import UserSection from "@/components/navComponents/UserSection.jsx";
import SearchNavbar from "@/components/navComponents/SearchNavbar.jsx";
import {useSelector} from "react-redux";

const AppNavbar = () => {
  const { state } = useUser();
  const [isSearchVisible, setSearchVisible] = useState(false);
  const toggleSearch = () => setSearchVisible((prev) => !prev);
  const u = useSelector((s) => s.user);
  console.log("[NavBar user]", u);

  return (
    <Box as="header" px={6} py={1} position="fixed" top="0" left="0" w="100%" bg="black" zIndex="1000">
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
          <Button as={RouterLink} to="/review" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
            Review
          </Button>
          <Button as={RouterLink} to="/board" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
            Board
          </Button>
          <Button as={RouterLink} to="/notice" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
            Magazine
          </Button>
          <Button as={RouterLink} to="/report" variant="ghost" color="white" _hover={{ bg: "transparent" }}>
            Report
          </Button>
        </HStack>

        <Spacer />

        {/* [항상 보임!] 검색 아이콘 + 로그인/유저 */}
        <IconButton
          aria-label="Toggle Search"
          color="white"
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
