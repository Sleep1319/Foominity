import { Button, Avatar, HStack, IconButton } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import SearchNavbar from "./SearchNavbar"; // 경로에 맞게 조정

const whiteNeonText = `
  -1px -1px 0 white,
   1px -1px 0 white,
  -1px  1px 0 white,
   1px  1px 0 white,
   0 0 4px white,
   0 0 8px white
`;

const AuthButtons = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const showNav = () => setIsNavVisible(true);
  const hideNav = () => setIsNavVisible(false);

  return (
    <>
      {/* 🔻 상단 네브바 (hover 유지) */}
      <SearchNavbar isVisible={isNavVisible} onMouseEnter={showNav} onMouseLeave={hideNav} />

      <HStack spacing={4} align="center">
        {/* 🔍 돋보기 버튼 */}
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          variant="ghost"
          onMouseEnter={showNav} // ✅ 이 부분이 핵심!
          bg="transparent"
          _hover={{ bg: "transparent" }}
        />

        <Button
          as={RouterLink}
          to="/login"
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
        >
          login
        </Button>

        <Button
          as={RouterLink}
          to="/register"
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
        >
          sign up
        </Button>

        <Avatar as={RouterLink} to="/mypage" size="sm" />
      </HStack>
    </>
  );
};

export default AuthButtons;
