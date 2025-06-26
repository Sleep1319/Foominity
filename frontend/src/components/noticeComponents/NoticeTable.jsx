// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   TableContainer,
//   Link as ChakraLink,
//   Spinner,
//   Text,
//   Box,
//   Button,
// } from "@chakra-ui/react";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import axios from "axios";

// const NoticeTable = () => {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null); // 사용자 정보
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("/api/notice/page?page=0");
//         setNotices(res.data.content);
//       } catch (err) {
//         console.error("공지사항 불러오기 실패", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("/api/user", { withCredentials: true });
//         setUserInfo(res.data);
//         console.log("ROLE:", userInfo?.roleName);
//       } catch (err) {
//         console.error("유저 정보 불러오기 실패", err);
//         setUserInfo(null); // 실패 시 null로 설정
//       }
//     };

//     fetchData();
//     fetchUser();
//   }, []);

//   if (loading || userInfo === null) return <Spinner size="lg" />;
//   if (!notices.length) return <Text textAlign="center">공지사항이 없습니다.</Text>;

//   return (
//     <Box>
//       {userInfo?.roleName?.toLowerCase() === "admin" && (
//         <Box textAlign="right" mb={4}>
//           <Button colorScheme="blue" onClick={() => navigate("/notice/create")}>
//             공지 작성
//           </Button>
//         </Box>
//       )}

//       <TableContainer>
//         <Table variant="simple" size="md">
//           <Thead>
//             <Tr>
//               <Th textAlign="center">번호</Th>
//               <Th textAlign="center">제목</Th>
//               <Th textAlign="center">작성일</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {notices.map((notice, index) => (
//               <Tr key={notice.id}>
//                 <Td textAlign="center">{notices.length - index}</Td>
//                 <Td textAlign="center">
//                   <ChakraLink as={RouterLink} to={`/notice/${notice.id}`}>
//                     {notice.title}
//                   </ChakraLink>
//                 </Td>
//                 <Td textAlign="center">{notice.createdAt?.split("T")[0]}</Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default NoticeTable;
