import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import AppleMusicSearch from "./AppleMusicSearch";

const AppleMusicSearchModal = ({ isOpen, onClose, onAlbumSelect }) => {
  // 앨범 선택 시 모달 닫기 + 상위로 콜백
  const handleSelect = (album) => {
    if (onAlbumSelect) onAlbumSelect(album); // 콜백 호출(상위에서 모달 닫기까지 같이)
    // 모달 닫기는 상위에서 처리
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>앨범 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AppleMusicSearch onAlbumSelect={handleSelect} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AppleMusicSearchModal;
