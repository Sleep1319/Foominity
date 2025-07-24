import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import Login from "../../components/siginComponents/Login"; // 너가 만든 로그인 폼 컴포넌트

const AuthModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontWeight="bold" fontSize="2xl" mt={8}>
          로그인
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8} pt={2}>
          <Login onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;

// import React, { useState } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   Button,
//   VStack,
//   FormControl,
//   Input,
//   Text,
//   Link,
//   Heading,
//   HStack,
//   Divider,
// } from "@chakra-ui/react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "@/context/UserContext.jsx";
// import SocialLoginButton from "@/components/siginComponents/SocialLoginButton.jsx";

// const AuthModal = ({ isOpen, onClose }) => {
//   // 소셜 로그인 텍스트 뜨는 거 때매 필요함
//   const [mode] = useState("login");
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();
//   const { setState } = useUser();
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       await axios.post(
//         "/api/sign-in",
//         { email: form.email, password: form.password },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const userRes = await axios.get("/api/user", { withCredentials: true });
//       setState(userRes.data);

//       setTimeout(() => {
//         window.location.href = "/";
//       }, 200);
//     } catch (err) {
//       setIsLoading(false);
//       setErrorMessage(err.response?.data?.message || "이메일 혹은 비밀번호를 확인해 주세요.");
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" blockScrollOnMount={false}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader textAlign="center">
//           <Heading mb={0} fontSize={25} mt={5}>
//             로그인
//           </Heading>
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody pb={6}>
//           <form onSubmit={handleLogin}>
//             <VStack spacing={4}>
//               <FormControl isRequired>
//                 <Input
//                   border="none"
//                   borderBottom="1px solid"
//                   borderColor="gray.300"
//                   borderRadius="0"
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="아이디 입력 (example@email.com)"
//                 />
//               </FormControl>
//               <FormControl isRequired>
//                 <Input
//                   border="none"
//                   borderBottom="1px solid"
//                   borderColor="gray.300"
//                   borderRadius="0"
//                   name="password"
//                   type="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   autoComplete="current-password"
//                   placeholder="비밀번호 입력"
//                 />
//               </FormControl>
//               {errorMessage && (
//                 <Text color="red.500" fontSize="sm" alignSelf="start" mt={-2}>
//                   {errorMessage}
//                 </Text>
//               )}
//               <HStack ml={250} justify="center">
//                 <Link
//                   fontSize="sm"
//                   color="black"
//                   onClick={() => {
//                     navigate("/findpassword");
//                     onClose();
//                   }}
//                 >
//                   비밀번호 찾기
//                 </Link>
//                 <Divider orientation="vertical" h="12px" borderColor="gray.300" />
//                 <Link
//                   fontSize="sm"
//                   color="black"
//                   onClick={() => {
//                     navigate("/register");
//                     onClose();
//                   }}
//                 >
//                   회원가입
//                 </Link>
//               </HStack>
//               <Button
//                 type="submit"
//                 isLoading={isLoading}
//                 loadingText="로그인 중..."
//                 colorScheme="blue"
//                 width="100%"
//                 bg="black"
//                 _hover={{ bg: "gray" }}
//               >
//                 로그인
//               </Button>

//               <SocialLoginButton mode={mode} />
//             </VStack>
//           </form>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default AuthModal;
