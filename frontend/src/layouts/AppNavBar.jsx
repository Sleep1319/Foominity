import { Box, HStack, Heading, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { useUser } from "@/context/UserContext";
import { useColorMode } from "@chakra-ui/react";
import NavMenu from "@/components/navComponents/NavMenu.jsx";
import AuthButtons from "@/components/navComponents/AuthButtons.jsx";
import UserSection from "@/components/navComponents/UserSection.jsx";
import ColorModeToggle from "@/components/navComponents/ColorModeToggle.jsx";

const AppNavbar = () => {
  const {state} = useUser();
  const { colorMode } = useColorMode();

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
        <Heading as={RouterLink} to="/" size="md">
          FOOMINITY
        </Heading>

        <Spacer />
        <NavMenu/>

        <Spacer />
        {state && state.nickname ? <UserSection/> : <AuthButtons/>}

        <ColorModeToggle/>
      </HStack>
    </Box>
  );
};

export default AppNavbar;
