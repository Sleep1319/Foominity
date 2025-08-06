import React from "react";
import dayjs from "dayjs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Box, Text } from "@chakra-ui/react";

function groupReviewsByDate(reviews, days = 7) {
  const today = dayjs().startOf("day");
  const map = {};

  for (let i = 0; i < days; i++) {
    const d = today.subtract(i, "day").format("YYYY-MM-DD");
    map[d] = 0;
  }

  reviews.forEach((r) => {
    const d = dayjs(r.createdDate).format("YYYY-MM-DD");
    if (map[d] !== undefined) map[d]++;
  });

  return Object.entries(map)
    .reverse()
    .map(([date, count]) => ({ date, count }));
}

const ReviewTrendChart = ({ reviews }) => {
  const data = groupReviewsByDate(reviews);

  const hasAnyReview = data.some((d) => d.count > 0);

  if (!hasAnyReview) {
    return (
      <Box p={4}>
        <Text textAlign="center" color="gray.500">
          아직 평가에 참여한 앨범이 없습니다.
        </Text>
      </Box>
    );
  }

  return (
    <Box w="100%" h="300px" mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={2} ml={10}>
        최근 7일 리뷰 작성 현황
      </Text>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip formatter={(value) => `${value}개 작성`} />
          <Bar dataKey="count" fill="#4299E1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ReviewTrendChart;
