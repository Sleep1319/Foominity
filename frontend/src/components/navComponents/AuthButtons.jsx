import React, { useState } from "react";
import { Button, HStack, Avatar, IconButton } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import SearchNavbar from "./SearchNavBar";
import AuthModal from "../../view/Sign/AuthModal";

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

  return (
    <>
      <HStack spacing={4} align="center">
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
          onClick={() => setLoginOpen(true)}
        >
          SIGN
        </Button>
      </HStack>

      {/*  로그인 모달 */}
      <AuthModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default AuthButtons;
