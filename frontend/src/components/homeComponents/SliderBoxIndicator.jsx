import React from "react";
import { Box } from "@chakra-ui/react";

const SliderBoxIndicator = ({ total, currentIndex, onDotClick }) => {
  return (
    <Box position="absolute" bottom="30px" left="50%" transform="translateX(-50%)" display="flex" gap="8px" zIndex="10">
      {Array.from({ length: total }).map((_, idx) => (
        <Box
          as="button"
          key={idx}
          w="8px"
          h="8px"
          borderRadius="full"
          bg={idx === currentIndex ? "red.600" : "gray.500"}
          transition="all 0.3s"
          onClick={() => onDotClick?.(idx)}
          cursor="pointer"
          _hover={{ bg: idx === currentIndex ? "red.600" : "gray.400" }}
        />
      ))}
    </Box>
  );
};

export default SliderBoxIndicator;
