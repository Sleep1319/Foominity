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
