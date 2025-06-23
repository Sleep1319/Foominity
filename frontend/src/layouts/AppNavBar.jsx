import { Box, HStack, Spacer, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import AuthButtons from "@/components/navComponents/AuthButtons.jsx";
import UserSection from "@/components/navComponents/UserSection.jsx";

import logoImage from "@/assets/images/doremiSOL_logo.png";

const AppNavbar = () => {
  const { state } = useUser();

  return (
    <Box as="header" px={6} py={1} position="absolute" top="0" left="0" w="100%" bg="transparent" zIndex="9999">
      <HStack align="center" justify="space-between">
        <Box as={RouterLink} to="/">
          <Image src={logoImage} alt="doremiSOL Logo" boxSize="72px" objectFit="contain" />
        </Box>

        <Spacer />
        {state && state.nickname ? <UserSection /> : <AuthButtons />}
      </HStack>
    </Box>
  );
};

export default AppNavbar;
