import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Image, Text, VStack, SimpleGrid, Spinner, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ParticipatedAlbums = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const previewCount = 4;
  const boxSize = 210;

  useEffect(() => {
    axios
      .get("/api/member/participated-albums", { withCredentials: true })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("내가 평가한 앨범 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        평가한 앨범이 없습니다.
      </Box>
    );
  }

  const preview = reviews.slice(0, previewCount);

  return (
    <SimpleGrid columns={2} spacing={4}>
      {preview.map((r) => (
        <VStack key={r.id} spacing={2} align="start" w={`${boxSize}px`}>
          <Box w={`${boxSize}px`} h={`${boxSize}px`} cursor="pointer" onClick={() => navigate(`/review/${r.id}`)}>
            <Image
              src={r.imagePath && `http://localhost:8084/${r.imagePath}`}
              alt={r.title}
              w="100%"
              h="100%"
              objectFit="cover"
              borderRadius="md"
              boxShadow="md"
            />
          </Box>

          <Text
            fontSize="md"
            fontWeight="semibold"
            cursor="pointer"
            noOfLines={2}
            onClick={() => navigate(`/review/${r.id}`)}
            _hover={{ fontWeight: "bold" }}
          >
            {r.title}
          </Text>

          <Text fontSize="sm" color="gray.600" noOfLines={1}>
            {r.artists?.map((a, i) => (
              <React.Fragment key={a.id ?? i}>
                <Text
                  as="span"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artist/${a.id}`);
                  }}
                  _hover={{ color: "black", fontWeight: "medium" }}
                >
                  {a.name}
                </Text>
                {i < r.artists.length - 1 && ", "}
              </React.Fragment>
            ))}
          </Text>
        </VStack>
      ))}
    </SimpleGrid>
  );
};

export default ParticipatedAlbums;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Image,
//   Text,
//   VStack,
//   SimpleGrid,
//   Spinner,
//   Center,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";

// const ParticipatedAlbums = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const navigate = useNavigate();

//   const previewCount = 4;
//   const boxSize = 210;

//   useEffect(() => {
//     axios
//       .get("/api/member/participated-albums", { withCredentials: true })
//       .then((res) => setReviews(res.data))
//       .catch((err) => console.error("내가 평가한 앨범 불러오기 실패:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <Center h="200px">
//         <Spinner size="lg" />
//       </Center>
//     );
//   }
//   if (reviews.length === 0) {
//     return (
//       <Box textAlign="center" py={8}>
//         평가한 앨범이 없습니다.
//       </Box>
//     );
//   }

//   const preview = reviews.slice(0, previewCount);

//   return (
//     <Box maxW="650px" mx="auto" px={4} py={8}>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" mb={4}>
//         {/* <Text fontSize="2xl" fontWeight="bold">
//           내가 평가한 앨범
//         </Text> */}
//         {reviews.length > previewCount && (
//           <Button size="sm" variant="outline" colorScheme="cyan" onClick={onOpen}>
//             전체보기
//           </Button>
//         )}
//       </Box>

//       {/* Preview grid */}
//       <SimpleGrid columns={2} spacing={4} mb={4}>
//         {/* {preview.map((r, idx) => ( */}
//         {preview.map((r) => (
//           <VStack key={r.id} spacing={2} align="start" w={`${boxSize}px`}>
//             <Box w={`${boxSize}px`} h={`${boxSize}px`} cursor="pointer" onClick={() => navigate(`/review/${r.id}`)}>
//               <Image
//                 src={r.imagePath && `http://localhost:8084/${r.imagePath}`}
//                 alt={r.title}
//                 w="100%"
//                 h="100%"
//                 objectFit="cover"
//                 borderRadius="md"
//                 boxShadow="md"
//               />
//             </Box>
//             {/* <Text fontSize="sm" color="gray.500">
//               #{idx + 1}
//             </Text> */}
//             <Text
//               fontSize="md"
//               fontWeight="semibold"
//               cursor="pointer"
//               noOfLines={2}
//               onClick={() => navigate(`/review/${r.id}`)}
//               _hover={{
//                 fontWeight: "bold",
//               }}
//             >
//               {r.title}
//             </Text>

//             <Text fontSize="sm" color="gray.600" noOfLines={1}>
//               {r.artists?.map((a, i) => (
//                 <React.Fragment key={a.id ?? i}>
//                   <Text
//                     as="span"
//                     cursor="pointer"
//                     onClick={(e) => {
//                       e.stopPropagation(); // 카드 클릭 막기
//                       navigate(`/artist/${a.id}`);
//                     }}
//                     _hover={{
//                       color: "black",
//                       fontWeight: "medium",
//                     }}
//                   >
//                     {a.name}
//                   </Text>
//                   {i < r.artists.length - 1 && ", "}
//                 </React.Fragment>
//               ))}
//             </Text>

//             {/* <Text fontSize="sm">평균별점: {r.averageStarPoint.toFixed(1)}</Text> */}
//           </VStack>
//         ))}
//       </SimpleGrid>

//       {/* Modal */}
//       <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>내가 평가한 앨범 전체보기</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody maxH="80vh" overflowY="auto" sx={{ overscrollBehaviorY: "contain" }}>
//             <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
//               {reviews.map((r) => (
//                 <VStack
//                   key={r.id}
//                   spacing={2}
//                   align="start"
//                   cursor="pointer"
//                   onClick={() => {
//                     onClose();
//                     navigate(`/review/${r.id}`);
//                   }}
//                 >
//                   <Image
//                     src={r.imagePath && `http://localhost:8084/${r.imagePath}`}
//                     alt={r.title}
//                     w="160px"
//                     h="160px"
//                     objectFit="cover"
//                     borderRadius="md"
//                     boxShadow="md"
//                   />
//                   <Text fontWeight="bold" noOfLines={1}>
//                     {r.title}
//                   </Text>
//                   <Text fontSize="sm" color="gray.600" noOfLines={1}>
//                     {r.artists?.map((a) => a.name).join(", ")}
//                   </Text>
//                   {/* <Text fontSize="sm">평균별점: {r.averageStarPoint.toFixed(1)}</Text> */}
//                 </VStack>
//               ))}
//             </SimpleGrid>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default ParticipatedAlbums;
