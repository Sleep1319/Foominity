import React from "react";
import { HStack } from "@chakra-ui/react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const RatingSummaryStar = ({ value, size = "18px" }) => {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <HStack spacing={1} as="span">
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} size={size} color="#ECC94B" />
      ))}
      {hasHalf && <FaStarHalfAlt size={size} color="#ECC94B" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e${i}`} size={size} color="#ECC94B" />
      ))}
    </HStack>
  );
};

export default RatingSummaryStar;
