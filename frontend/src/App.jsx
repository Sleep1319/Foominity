import React from "react";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import AppNavBar from "./layouts/AppNavBar.jsx";
import AppRoutes from "@/routes/Routes.jsx";
import AppFooter from "@/layouts/AppFooter.jsx";
import { UserProvider } from "@/context/UserContext.jsx";

function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <Flex direction="column" minHeight="100vh">
          <AppNavBar />
          <Box as="main" flex="1">
            <AppRoutes />
          </Box>
          <AppFooter />
        </Flex>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
