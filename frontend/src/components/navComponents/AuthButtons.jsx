import React, { useState } from "react";
import { Button, HStack } from "@chakra-ui/react";
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

      {/* 로그인/회원가입 탭 전환형 모달 */}
      <AuthModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default AuthButtons;
