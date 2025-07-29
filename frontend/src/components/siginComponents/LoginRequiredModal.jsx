import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LoginRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Image
            src="/src/assets/images/doremiSOL_lp.png"
            boxSize="100px"
            objectFit="cover"
            display="block" // inline 요소인 이미지를 block 으로 전환
            mx="auto" // 좌우 margin: auto
            mt="-20px"
            mb="-42px"
          />
        </ModalHeader>
        <ModalBody textAlign="center">로그인을 하신 후 이용해 주시기 바랍니다.</ModalBody>
        <ModalFooter justifyContent="center" display="flex">
          <Button bg="white" color="black" onClick={() => navigate("/loginpage")}>
            로그인
          </Button>
          <Button variant="ghost" ml={3} onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginRequiredModal;
