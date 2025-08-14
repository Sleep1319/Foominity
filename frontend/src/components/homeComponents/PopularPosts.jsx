import { Box, Heading } from "@chakra-ui/react";
import AppleMusicChartKr from "./AppleMusicChartKr";

const PopularPosts = () => {
  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>
        {/* 오늘의 인기곡 (Apple Music) */}
      </Heading>

      {/* 인기댓글 자리 → AppleMusic 차트 삽입 */}
      <AppleMusicChartKr
        country="kr"
        boxMaxH={420} // 사진의 우측 박스 높이에 맞춤
        initialVisible={12} // 첫 표시 개수
        step={8} // 스크롤 시 추가 로드 개수
      />
      {/* <AppleMusicChart
        country="kr"
        boxMaxH={420} // 사진의 우측 박스 높이에 맞춤
        initialVisible={12} // 첫 표시 개수
        step={8} // 스크롤 시 추가 로드 개수
      /> */}
    </Box>
  );
};

export default PopularPosts;

// import { Box, Heading, List, ListItem, Text, Spinner } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const PopularPosts = () => {
//   const [popularPosts, setPopularPosts] = useState([]);
//   const [state, setState] = useState(true);

//   useEffect(() => {
//     const fetchPopularPosts = async () => {
//       try {
//         const response = await axios.get("/api/reviews/top");
//         setPopularPosts(response.data);
//       } catch (error) {
//         console.log();
//       } finally {
//         setState(false);
//       }
//     };
//     fetchPopularPosts();
//   }, []);

//   return (
//     <Box mb={8}>
//       <Heading size="md" mb={4}>
//         {/* 오늘의 인기글 */}
//       </Heading>
//       {state ? (
//         <List spacing={2}>
//           {popularPosts.slice(0, 5).map((post) => (
//             <ListItem key={post.id}>
//               <Text fontWeight="semibold">{post.title}</Text>
//               <Text fontSize="sm" color="gray.500">
//                 by {post.author}
//               </Text>
//             </ListItem>
//           ))}
//         </List>
//       ) : (
//         <Text color="gray.400">인기댓글이 없습니다.</Text>
//       )}
//     </Box>
//   );
// };

// export default PopularPosts;
