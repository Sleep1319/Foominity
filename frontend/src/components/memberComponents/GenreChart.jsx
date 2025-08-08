import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// 20가지 파스텔톤 HSL 컬러 팔레트
// 무채색 계열 7단계 팔레트 (진할수록 앞 순서)
const COLORS = [
  "#222222", // very dark gray
  "#666666",
  "#AAAAAA",
  "#CCCCCC",
];

// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const { genre, count } = payload[0].payload;
//     return (
//       <Box bg="white" border="1px solid #ccc" p={2} borderRadius="md" boxShadow="md">
//         <Text fontSize="sm">{`${genre} - ${count}회`}</Text>
//       </Box>
//     );
//   }
//   return null;
// };
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { genre } = payload[0].payload;
    return (
      <Box bg="white" border="1px solid #ccc" p={2} borderRadius="md" boxShadow="md">
        <Text fontSize="sm">{`${genre}`}</Text>
      </Box>
    );
  }
  return null;
};

const GenreChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box p={4}>
        <Text textAlign="center" color="gray.500">
          아직 좋아요를 누른 장르가 없습니다.
        </Text>
      </Box>
    );
  }

  // 1) count 기준 내림차순 정렬
  const sorted = [...data].sort((a, b) => b.count - a.count);

  // 2) 상위 3개, 나머지 등치 합쳐 '기타'
  const topN = 3;
  const topItems = sorted.slice(0, topN);
  const others = sorted.slice(topN);
  const othersCount = others.reduce((sum, item) => sum + item.count, 0);
  const chartData = othersCount > 0 ? [...topItems, { genre: "기타", count: othersCount }] : topItems;

  // 3) legendPayload 역시 동일 순서로
  const legendPayload = chartData.map((entry, idx) => ({
    value: entry.genre,
    type: "circle",
    id: entry.genre,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <Box w="100%" h="300px" p={4}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 20 }}>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="genre"
            cx="50%"
            cy="40%"
            outerRadius={80}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, idx) => (
              <Cell key={entry.genre} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            payload={legendPayload}
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            wrapperStyle={{
              top: "40%",
              right: 40,
              transform: "translateY(-50%)",
              lineHeight: "24px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GenreChart;
