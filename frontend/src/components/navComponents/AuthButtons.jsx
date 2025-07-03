import React, { useState } from "react";
import { Button, HStack, Avatar, IconButton } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import SearchNavbar from "./SearchNavBar";
import AuthModal2 from "../../view/Sign/AuthModal2";

const whiteNeonText = `
  -1px -1px 0 white,
   1px -1px 0 white,
  -1px  1px 0 white,
   1px  1px 0 white,
   0 0 4px white,
   0 0 8px white
`;

const AuthButtons = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);

  const showNav = () => setIsNavVisible(true);
  const hideNav = () => setIsNavVisible(false);

  return (
    <>
      {/* 상단 네브바  */}
      <SearchNavbar isVisible={isNavVisible} onMouseEnter={showNav} onMouseLeave={hideNav} />

      <HStack spacing={4} align="center">
        {/* 돋보기 버튼 */}
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          variant="ghost"
          onMouseEnter={showNav}
          bg="transparent"
          _hover={{ bg: "transparent" }}
        />

        <Button
          variant="ghost"
          color="black"
          px={4}
          py={2}
          bg="transparent"
          borderRadius="lg"
          textShadow={whiteNeonText}
          _hover={{
            textDecoration: "underline",
            bg: "transparent",
          }}
          onClick={() => setLoginOpen(true)} // 클릭 시 모달 열기
        >
          SIGN
        </Button>
      </HStack>

      {/*  로그인 모달 */}
      <AuthModal2 isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default AuthButtons;
