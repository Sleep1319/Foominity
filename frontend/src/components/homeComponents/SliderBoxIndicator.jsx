import React from "react";
import { Box } from "@chakra-ui/react";

const SliderBoxIndicator = ({ total, currentIndex, onDotClick, useAbsolute = true }) => {
  return (
    <Box
      position={useAbsolute ? "absolute" : "static"}
      bottom={useAbsolute ? "30px" : undefined}
      left={useAbsolute ? "50%" : undefined}
      transform={useAbsolute ? "translateX(-50%)" : undefined}
      display="flex"
      gap="8px"
      zIndex="10"
      justifyContent={useAbsolute ? undefined : "flex-start"}
    >
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
