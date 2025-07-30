// src/components/CropperModal.jsx

import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import Cropper from "react-easy-crop";

const CropperModal = ({ imageSrc, isOpen, onClose, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
    });
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCrop = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onComplete(croppedBlob);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="650px" maxH="60vh" h="90vh">
        <ModalBody position="relative" w="100%" h="100%" bg="gray.800" p={0}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showGrid={false}
            />
          )}
        </ModalBody>
        <ModalFooter flexDirection="column" gap={4}>
          <Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom}>
            <SliderTrack bg="gray.300">
              <SliderFilledTrack bg="black" />
            </SliderTrack>
            <SliderThumb boxSize={4} bg="black" />
          </Slider>
          <Button onClick={handleCrop} w="full" bg="black" color="white" _hover={{ bg: "gray.800" }}>
            자르기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CropperModal;
