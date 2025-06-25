// components/StarRating.jsx
import React from "react";
import { HStack, Icon, Box } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const StarRating = ({ rating, size = 4 }) => {
  const getStarFill = (index) => {
    const diff = rating - index;
    if (diff >= 1) return 1;
    if (diff > 0) return diff;
    return 0;
  };

  return (
    <HStack spacing="2px" alignItems="center">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = getStarFill(i);
        return (
          <Box key={i} position="relative" w={`${size * 4}px`} h={`${size * 4}px`}>
            <Icon as={StarIcon} boxSize={size} color="gray.300" />
            <Box position="absolute" top="0" left="0" w={`${fill * 100}%`} h="100%" overflow="hidden">
              <Icon as={StarIcon} boxSize={size} color="black" />
            </Box>
          </Box>
        );
      })}
    </HStack>
  );
};

export default StarRating;
