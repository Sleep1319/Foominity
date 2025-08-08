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
  "#888888",
  "#444444",
  "#EEEEEE", // very light gray
];

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
    <Box w="100%" h="350px" p={4}>
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

          <Tooltip />

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

// import React from "react";
// import { Box, Text } from "@chakra-ui/react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

// const GenreChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <Box p={4}>
//         <Text textAlign="center" color="gray.500">
//           아직 좋아요를 누른 장르가 없습니다.
//         </Text>
//       </Box>
//     );
//   }

//   return (
//     <Box w="100%" h="350px" p={4}>
//       {/* <Text mb={2} fontSize="lg" fontWeight="medium">
//         사용자가 좋아하는 장르 분포
//       </Text> */}
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
//           <Pie
//             data={data}
//             dataKey="count"
//             nameKey="genre"
//             cx="20%"
//             cy="55%"
//             outerRadius={80}
//             label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
//             labelLine={false}
//             startAngle={90}
//             endAngle={-270}
//           >
//             {data.map((_, index) => (
//               <Cell key={index} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend
//             layout="horizontal"
//             align="center"
//             verticalAlign="bottom"
//             wrapperStyle={{ top: 250, lineHeight: "24px" }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// export default GenreChart;
