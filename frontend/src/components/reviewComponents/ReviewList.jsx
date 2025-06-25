import React from "react";
import { Box, Image, Text, HStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import StarRating from "./StarRating";

const ReviewList = ({ review }) => {
  const rating = typeof review.averageStarPoint === "number" ? review.averageStarPoint : 0;

  return (
    <RouterLink to={`/review/${review.id}`}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={2} // 줄 간격 살짝 좁게
        p={0}
        w="340px"
        mx="auto"
      >
        <Image src={review.imagePath || ""} alt={review.title} boxSize="320px" objectFit="cover" />

        <Text fontSize="sm" fontWeight="semibold">
          {review.categories?.map((c) => c.categoryName).join(", ") || "정보 없음"}
        </Text>

        <Text fontSize="3xl" fontWeight="bold">
          {review.title}
        </Text>

        <Text fontWeight="semibold">{review.artists?.map((a) => a.name).join(", ") || "정보 없음"}</Text>
        <HStack alignItems="baseline" spacing={1}>
          <Text fontSize="xl" fontWeight="bold">
            {rating.toFixed(2)}
          </Text>
          <Box mt="2px">
            <StarRating rating={rating} size={4} />
          </Box>
        </HStack>
      </Box>
    </RouterLink>
  );
};

export default ReviewList;
