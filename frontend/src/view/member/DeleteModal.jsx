import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Text,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

const AuthModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.request({
        method: "DELETE",
        url: "/api/delete-member",
        data: { password }, // body에 담기게 됨
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "/";
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        alert(err.response?.data?.message || "비밀번호가 일치하지 않습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleConfirm = async () => {
  //   if (!password) {
  //     alert("비밀번호를 입력해주세요.");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     await axios.delete("/api/delete-member", {
  //       data: { password }, // MemberRequest 형식
  //       withCredentials: true,
  //     });

  //     alert("회원 탈퇴가 완료되었습니다.");
  //     // 탈퇴 후 로그아웃 or 홈 이동 처리
  //     window.location.href = "/"; // 또는 navigate("/login")
  //   } catch (err) {
  //     console.error("회원 탈퇴 실패:", err);
  //     if (err.response?.status === 401) {
  //       alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
  //     } else {
  //       alert(err.response?.data?.message || "비밀번호가 일치하지 않습니다.");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" color="red.600" fontWeight="bold">
          회원 탈퇴 확인
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" color="gray.700" textAlign="center">
              정말로 회원 탈퇴를 진행하시겠습니까? <br />
              탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
            </Text>

            <Divider />

            <FormControl isRequired>
              <FormLabel>비밀번호 확인</FormLabel>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            mr={3}
            onClick={onClose}
            bg="white"
            color="black"
            isDisabled={isLoading}
            _hover={{
              bg: "black",
              color: "white",
            }}
          >
            취소
          </Button>
          <Button
            color="red"
            bg="white"
            onClick={handleConfirm}
            isLoading={isLoading}
            _hover={{
              bg: "red",
              color: "white",
            }}
          >
            회원 탈퇴
          </Button>
        </ModalFooter>
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
//   ModalFooter,
//   Button,
//   VStack,
//   FormControl,
//   FormLabel,
//   Input,
//   Text,
//   Divider,
// } from "@chakra-ui/react";

// const AuthModal = ({ isOpen, onClose, onConfirm }) => {
//   const [password, setPassword] = useState("");

//   const handleConfirm = () => {
//     // 비밀번호 입력 검증
//     if (!password) {
//       alert("비밀번호를 입력해주세요.");
//       return;
//     }
//     // 탈퇴 로직 호출
//     onConfirm(password);
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" blockScrollOnMount={false}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader textAlign="center" color="red.600" fontWeight="bold">
//           회원 탈퇴 확인
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <VStack spacing={4} align="stretch">
//             <Text fontSize="md" color="gray.700" textAlign="center">
//               정말로 회원 탈퇴를 진행하시겠습니까? <br />
//               탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
//             </Text>

//             <Divider />

//             <FormControl isRequired>
//               <FormLabel>비밀번호 확인</FormLabel>
//               <Input
//                 type="password"
//                 placeholder="비밀번호를 입력해주세요"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </FormControl>
//           </VStack>
//         </ModalBody>

//         <ModalFooter justifyContent="center">
//           <Button mr={3} onClick={onClose} bg="black" color="white">
//             취소
//           </Button>
//           <Button colorScheme="red" onClick={handleConfirm}>
//             회원 탈퇴
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default AuthModal;
