import { Box, Button, Divider, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const DeleteComplete = () => {
  const navigate = useNavigate();
  return (
    <>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        border="none"
        pb={2}
        mt={4}
        ml={5}
        height="85px"
      ></Text>

      <VStack mt={180}>
        <Heading fontSize={45} mb={5} textAlign="center">
          회원 탈퇴가 완료되었습니다
        </Heading>
        <HStack mt={7} mr="30px">
          <Link
            mr={2}
            bg="none"
            color="gray.500"
            fontWeight="semibold"
            onClick={() => navigate("/")}
            _hover={{ color: "black" }}
          >
            홈 화면으로 이동
          </Link>
          <Divider orientation="vertical" h="16px" borderColor="gray.500" />
          <Link
            ml={2}
            bg="none"
            color="gray.500"
            fontWeight="semibold"
            onClick={() => navigate("/register")}
            _hover={{ color: "black" }}
          >
            회원가입
          </Link>
        </HStack>
      </VStack>
    </>
  );
};

export default DeleteComplete;
// import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const DeleteComplete = () => {
//   const navigate = useNavigate();
//   return (
//     <Box
//       minH="100vh"
//       backgroundImage="url('/src/assets/images/deleteComplete_background.png')" // public 폴더에 있는 배경 이미지
//       backgroundSize="contains"
//       backgroundPosition="center"
//       backgroundRepeat="no-repeat"
//     >
//       <Text
//         lineHeight="2.5"
//         textAlign="center"
//         fontSize="3xl"
//         fontWeight="medium"
//         // borderBottom="2px solid gray"
//         border="none"
//         pb={2}
//         mt={4}
//         ml={5}
//         height="85px"
//       ></Text>

//       <Box
//         maxW="xl"
//         mx="auto"
//         mt={280}
//         p={5}
//         borderRadius="lg"
//         mb={142}
//         border="none"
//         bg="rgba(255, 255, 255, 0.85)" // 살짝 흰 배경으로 내용이 잘 보이게
//         backdropFilter="blur(4px)"
//       >
//         <VStack mt={20}>
//           <Heading mb={5} textAlign="center">
//             회원 탈퇴가 완료되었습니다.
//           </Heading>
//           <HStack mt={7}>
//             <Button bg="black" color="white" onClick={() => navigate("/")} _hover={{ bg: "black", color: "white" }}>
//               홈 화면으로 이동
//             </Button>
//             <Button
//               bg="black"
//               color="white"
//               onClick={() => navigate("/register")}
//               _hover={{ bg: "black", color: "white" }}
//             >
//               회원가입
//             </Button>
//           </HStack>
//         </VStack>
//       </Box>
//     </Box>
//   );
// };

// export default DeleteComplete;

//=========================================================================================

// import { Box, Button, Heading, HStack, Text, VStack, Image } from "@chakra-ui/react";
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const DeleteComplete = () => {
//   const navigate = useNavigate();

//   return (
//     <Box minH="100vh" bg="white">
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

//       <Box
//         maxW="xl"
//         mx="auto"
//         mt={30} // 메시지를 좀 위로 올림
//         p={5}
//         borderRadius="lg"
//         mb={0}
//         border="none"
//         bg="rgba(255, 255, 255, 0.85)"
//         backdropFilter="blur(4px)"
//       >
//         <VStack mt={10}>
//           <Heading mb={5} textAlign="center">
//             회원 탈퇴가 완료되었습니다.
//           </Heading>
//           <HStack mt={7}>
//             <Button bg="black" color="white" onClick={() => navigate("/")} _hover={{ bg: "black", color: "white" }}>
//               홈 화면으로 이동
//             </Button>
//             <Button
//               bg="black"
//               color="white"
//               onClick={() => navigate("/register")}
//               _hover={{ bg: "black", color: "white" }}
//             >
//               회원가입
//             </Button>
//           </HStack>
//         </VStack>
//       </Box>

//       {/* ✅ 탈퇴 완료 아래 삽입할 그림 */}
//       <Box mt={0} textAlign="center" mb={20}>
//         <Image
//           src="/src/assets/images/deleteComplete_background.png"
//           alt="탈퇴 완료 이미지"
//           maxW="900px"
//           mx="auto"
//           opacity={0.9}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default DeleteComplete;
