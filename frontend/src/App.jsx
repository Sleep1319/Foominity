import React from "react";
import {Box, ChakraProvider, Flex} from "@chakra-ui/react";
import AppNavBar from "./layouts/AppNavBar.jsx";
import AppRoutes from "./routes/Routes.jsx";
import AppFooter from "./layouts/AppFooter.jsx";
// import {UserProvider} from "./context/UserContext.jsx";
// import {ChatProvider} from "./context/ChatContext.jsx";

function App() {
    return (
        <ChakraProvider>
                    <Flex direction="column" minHeight="100vh">
                        <AppNavBar/>
                        <Box as="main" flex="1">
                            <AppRoutes/>
                        </Box>
                        <AppFooter/>
                    </Flex>
        </ChakraProvider>
    );
}

export default App;
