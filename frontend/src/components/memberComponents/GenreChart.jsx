import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

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

  return (
    <Box w="100%" h="350px" p={4} borderWidth="1px" borderRadius="md">
      <Text mb={2} fontSize="lg" fontWeight="medium">
        장르별 좋아요 분포
      </Text>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="genre"
            cx="50%"
            cy="45%"
            outerRadius={80}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
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
            wrapperStyle={{ top: 250, lineHeight: "24px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GenreChart;
