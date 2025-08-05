import React, { useEffect, useState } from "react";
import { Box, Text, Spinner, Center } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GenreChart({ memberId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 파이 차트에 사용할 색상
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  useEffect(() => {
    fetch(`/api/member/${memberId}/genre-stats`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json.map(({ genre, count }) => ({ genre, count })));
      })
      .catch((err) => console.error("장르 통계 로드 실패:", err))
      .finally(() => setLoading(false));
  }, [memberId]);

  if (loading) {
    return (
      <Center py={6}>
        <Spinner />
      </Center>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Box p={4}>
        <Text textAlign="center" color="gray.500">
          아직 좋아요를 누른 장르가 없습니다.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w="100%"
      h="350px" // 높이를 조금 늘려서 여유 공간 확보
      p={4}
      borderWidth="1px"
      borderRadius="md"
    >
      <Text mb={2} fontSize="lg" fontWeight="medium">
        장르별 좋아요 분포
      </Text>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          margin={{ top: 20, right: 20, bottom: 60, left: 20 }} // 차트 안쪽 여백
        >
          <Pie
            data={data}
            dataKey="count"
            nameKey="genre"
            cx="50%"
            cy="45%" // 레전드 공간을 위해 살짝 위로
            outerRadius={80} // 반경을 줄여서 레이블 겹침 방지
            // paddingAngle={0} // 조각 사이 간격
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // 내부에 퍼센트만 표시
            labelLine={false} // 연결선 제거
            startAngle={90}
            endAngle={-270}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ top: 250, lineHeight: "24px" }} // legend 위치 세밀 조정
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
