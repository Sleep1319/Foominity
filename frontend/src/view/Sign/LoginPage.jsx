// LoginPage.jsx
import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import Login from "../../components/siginComponents/Login";

const LoginPage = () => {
  return (
    <>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        pb={2}
        mt={4}
        ml={5}
        height="85px"
      ></Text>
      <Box
        flex={1} // <-- 핵심! 100vh 사용X, flex-grow만 사용
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="none"
        p={0}
        m={0}
        mt="150px"
      >
        <Heading textAlign="center" mb={10} fontWeight="bold" fontSize="4xl">
          로그인
        </Heading>
        <Box w="100%" maxW="535px">
          <Login />
        </Box>
      </Box>
    </>
  );
};
export default LoginPage;

// import React from "react";
// import { Box, Heading, Text } from "@chakra-ui/react";
// import Login from "../../components/siginComponents/Login";

// const LoginPage = () => {
//   return (
//     <>
//       <Text
//         lineHeight="2.5"
//         textAlign="center"
//         fontSize="3xl"
//         fontWeight="medium"
//         borderBottom="2px solid gray"
//         pb={2}
//         mt={4}
//         ml={5}
//         height="85px"
//       ></Text>
//       <Box display="flex" flexDirection="column" alignItems="center" minH="75vh" justifyContent="center" bg="none">
//         <Heading textAlign="center" mb={10} fontWeight="bold" fontSize="4xl">
//           로그인
//         </Heading>
//         <Box w="100%" maxW="535px" mb="120px">
//           <Login />
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default LoginPage;
