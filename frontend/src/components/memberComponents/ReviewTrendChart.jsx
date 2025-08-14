// src/components/memberComponents/ReviewTrendChart.jsx
import React, { useState } from "react";
import dayjs from "dayjs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Box, Text, Select, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function groupReviews(reviews, days) {
  console.log("trend input size:", (reviews || []).length);
  console.table(
    (reviews || []).slice(0, 8).map((r) => ({
      createdDate: r?.createdDate,
    }))
  );

  // days === "all" → 월별 집계
  if (days === "all") {
    // 이번 연도 1월부터 현재 월까지 map 초기화
    const currentMonth = dayjs().month() + 1; // 1~12
    const map = {};
    for (let m = 1; m <= currentMonth; m++) {
      // '1월', '2월' 등 라벨
      map[m] = 0;
    }
    // 리뷰 날짜의 월을 센다
    reviews.forEach((r) => {
      const m = dayjs(r.createdDate).month() + 1;
      if (map[m] !== undefined) map[m]++;
    });
    // 결과 배열로 변환
    return Object.entries(map).map(([month, count]) => ({
      // month: '1월', '2월' …
      date: `${month}월`,
      count,
    }));
  }

  // days가 숫자("7" | "30") → 기존 로직 (최근 n일)
  const n = Number(days);
  const today = dayjs().startOf("day");
  const map = {};
  for (let i = 0; i < n; i++) {
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
  const [range, setRange] = useState("7"); // "7" | "30" | "all"
  const data = groupReviews(reviews, range);
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <Box p={4}>
        <Text textAlign="center" color="gray.500">
          아직 평가에 참여한 앨범이 없습니다.
          <Link to="/review"> 앨범게시판 이동</Link>
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={4} w="100%">
      {/* 기간 선택 드롭다운 */}
      <Box textAlign="right" ml="15px">
        <Select w="120px" size="sm" value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="7">최근 7일</option>
          <option value="30">최근 30일</option>
          <option value="all">올해 (월별)</option>
        </Select>
      </Box>

      {/* 차트 */}
      <Box w="100%" h="300px">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} />
            <Tooltip formatter={(value) => `${value}개 작성`} />
            <Bar dataKey="count" fill="black" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </VStack>
  );
};

export default ReviewTrendChart;

// import React from "react";
// import dayjs from "dayjs";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
// import { Box, Text } from "@chakra-ui/react";
// import { Link } from "react-router-dom";

// function groupReviewsByDate(reviews, days = 7) {
//   const today = dayjs().startOf("day");
//   const map = {};

//   for (let i = 0; i < days; i++) {
//     const d = today.subtract(i, "day").format("YYYY-MM-DD");
//     map[d] = 0;
//   }

//   reviews.forEach((r) => {
//     const d = dayjs(r.createdDate).format("YYYY-MM-DD");
//     if (map[d] !== undefined) map[d]++;
//   });

//   return Object.entries(map)
//     .reverse()
//     .map(([date, count]) => ({ date, count }));
// }

// const ReviewTrendChart = ({ reviews }) => {
//   const data = groupReviewsByDate(reviews);

//   const hasAnyReview = data.some((d) => d.count > 0);

//   if (!hasAnyReview) {
//     return (
//       <Box p={4}>
//         <Text textAlign="center" color="gray.500">
//           아직 평가에 참여한 앨범이 없습니다.
//           <Link to="/review"> 앨범게시판 이동</Link>
//         </Text>
//       </Box>
//     );
//   }

//   return (
//     <Box w="100%" h="300px" mt={8}>
//       {/* <Text fontSize="lg" fontWeight="medium" mb={2} ml={10}>
//         최근 7일 리뷰 작성 현황
//       </Text> */}
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" fontSize={12} />
//           <YAxis allowDecimals={false} fontSize={12} />
//           <Tooltip formatter={(value) => `${value}개 작성`} />
//           <Bar dataKey="count" fill="black" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// export default ReviewTrendChart;
