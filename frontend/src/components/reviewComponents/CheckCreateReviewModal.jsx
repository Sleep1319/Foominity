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
  Text,
  Divider,
} from "@chakra-ui/react";

const CheckCreateReviewModal = ({ isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(); // 부모의 handleSubmit 실행!
      onClose(); // 모달 닫기
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" color="black" fontWeight="bold">
          앨범 등록
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" color="gray.700" textAlign="center">
              앨범을 등록하시겠습니까?
            </Text>
            <Divider />
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            mr={3}
            onClick={handleConfirm}
            bg="gray.100"
            color="black"
            isLoading={isLoading}
            _hover={{ bg: "gray.200", color: "black" }}
            w="90px"
          >
            앨범 등록
          </Button>
          <Button color="black" bg="gray.100" w="90px" onClick={onClose} _hover={{ bg: "gray.200", color: "black" }}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CheckCreateReviewModal;
