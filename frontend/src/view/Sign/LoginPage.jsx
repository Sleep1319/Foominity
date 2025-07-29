// LoginPage.jsx
import React, {useEffect, useRef, useState} from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Login from "../../components/siginComponents/Login";



const LoginPage = () => {
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const query = new URLSearchParams(location.search);
        const reason = query.get("reason");

        if (reason === "email-already-registered") {
            alert("이미 일반 계정으로 가입된 이메일입니다. 일반 로그인을 이용해주세요.");
        } else if (reason === "provider-mismatch") {
            alert("다른 소셜 로그인으로 가입된 계정입니다. 처음 사용한 소셜 로그인으로 시도해주세요.");
        } else if (reason === "oauth-failed") {
            alert("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
        }
    }, [location.search]);
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
