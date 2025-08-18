import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Image, Text, VStack, SimpleGrid, Spinner, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LikedAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const previewCount = 4;
  const boxSize = 210;

  useEffect(() => {
    axios
      .get("/api/member/liked-albums", { withCredentials: true })
      .then((res) => {
        const mapped = res.data.map((album) => {
          const artistsArr = (album.artists ?? []).map((a) => ({
            id: a.id ?? a.artistId ?? a.artist_id ?? null,
            name: a.name ?? a.artistName ?? "",
          }));
          return {
            id: album.id,
            imagePath: album.imagePath || album.coverImage || "",
            title: album.title,
            artist: artistsArr.map((a) => a.name).join(", "),
            artists: artistsArr,
          };
        });
        setAlbums(mapped);
      })
      .catch((err) => console.error("좋아요 앨범 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  const goArtist = (e, a) => {
    e.stopPropagation();
    if (a?.id) navigate(`/artist/${a.id}`);
  };

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (albums.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        좋아요 표시한 앨범이 없습니다.
      </Box>
    );
  }

  const preview = albums.slice(0, previewCount);

  return (
    <SimpleGrid columns={2} spacing={4}>
      {preview.map((album) => (
        <VStack key={album.id} spacing={2} align="start" w={`${boxSize}px`}>
          <Box w={`${boxSize}px`} h={`${boxSize}px`} cursor="pointer" onClick={() => navigate(`/review/${album.id}`)}>
            <Image
              src={album.imagePath && `http://localhost:8084/${album.imagePath}`}
              alt={album.title}
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
            noOfLines={2}
            cursor="pointer"
            onClick={() => navigate(`/review/${album.id}`)}
          >
            {album.title}
          </Text>

          <Text fontSize="sm" color="gray.600" noOfLines={1}>
            {Array.isArray(album.artists) && album.artists.length > 0
              ? album.artists.map((a, i) => (
                  <React.Fragment key={a.id ?? `${a.name}-${i}`}>
                    <Text
                      as="span"
                      cursor="pointer"
                      onClick={(e) => goArtist(e, a)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") goArtist(e, a);
                      }}
                      _hover={{ color: "black", fontWeight: "medium" }}
                    >
                      {a.name}
                    </Text>
                    {i < album.artists.length - 1 && ", "}
                  </React.Fragment>
                ))
              : album.artist}
          </Text>
        </VStack>
      ))}
    </SimpleGrid>
  );
};

export default LikedAlbums;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Image,
//   Text,
//   VStack,
//   SimpleGrid,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   useDisclosure,
//   Spinner,
// } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";

// const LikedAlbums = () => {
//   const [albums, setAlbums] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const navigate = useNavigate();

//   const previewCount = 4;
//   const boxSize = 210;

//   useEffect(() => {
//     axios
//       .get("/api/member/liked-albums", { withCredentials: true })
//       .then((res) => {
//         const mapped = res.data.map((album) => {
//           const artistsArr = (album.artists ?? []).map((a) => ({
//             id: a.id ?? a.artistId ?? a.artist_id ?? null,
//             name: a.name ?? a.artistName ?? "",
//           }));
//           return {
//             id: album.id,
//             imagePath: album.imagePath || album.coverImage || "",
//             title: album.title,
//             artist: artistsArr.map((a) => a.name).join(", "),
//             artists: artistsArr,
//           };
//         });
//         setAlbums(mapped);
//       })
//       .catch((err) => console.error("좋아요 앨범 불러오기 실패:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   const goArtist = (e, a) => {
//     e.stopPropagation();
//     if (a?.id) navigate(`/artist/${a.id}`);
//   };

//   if (loading) {
//     return (
//       <Box textAlign="center" py={8}>
//         <Spinner size="lg" />
//       </Box>
//     );
//   }

//   if (albums.length === 0) {
//     return (
//       <Box textAlign="center" py={8}>
//         좋아요 표시한 앨범이 없습니다.
//       </Box>
//     );
//   }

//   const preview = albums.slice(0, previewCount);

//   return (
//     <Box maxW="650px" mx="auto" px={4} py={8}>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" mb={4}>
//         {/* <Text fontSize="2xl" fontWeight="bold">
//           내가 좋아하는 앨범
//         </Text> */}
//         {albums.length > previewCount && (
//           <Button size="sm" variant="outline" colorScheme="cyan" onClick={onOpen}>
//             전체보기
//           </Button>
//         )}
//       </Box>

//       {/* Preview grid (2x2) */}
//       <SimpleGrid columns={2} spacing={4} mb={4}>
//         {preview.map((album) => (
//           <VStack key={album.id} spacing={2} align="start" w={`${boxSize}px`}>
//             <Box w={`${boxSize}px`} h={`${boxSize}px`} cursor="pointer" onClick={() => navigate(`/review/${album.id}`)}>
//               <Image
//                 src={album.imagePath && `http://localhost:8084/${album.imagePath}`}
//                 alt={album.title}
//                 w="100%"
//                 h="100%"
//                 objectFit="cover"
//                 borderRadius="md"
//                 boxShadow="md"
//               />
//             </Box>

//             <Text
//               fontSize="md"
//               fontWeight="semibold"
//               noOfLines={2}
//               cursor="pointer"
//               onClick={() => navigate(`/review/${album.id}`)}
//             >
//               {album.title}
//             </Text>

//             {/* 아티스트: 이름별 클릭 이동 */}
//             <Text fontSize="sm" color="gray.600" noOfLines={1}>
//               {Array.isArray(album.artists) && album.artists.length > 0
//                 ? album.artists.map((a, i) => (
//                     <React.Fragment key={a.id ?? `${a.name}-${i}`}>
//                       <Text
//                         as="span"
//                         cursor="pointer"
//                         // textDecoration="underline"
//                         onClick={(e) => goArtist(e, a)}
//                         role="button"
//                         tabIndex={0}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" || e.key === " ") goArtist(e, a);
//                         }}
//                         _hover={{
//                           color: "black",
//                           fontWeight: "medium",
//                         }}
//                       >
//                         {a.name}
//                       </Text>
//                       {i < album.artists.length - 1 && ", "}
//                     </React.Fragment>
//                   ))
//                 : album.artist}
//             </Text>
//           </VStack>
//         ))}
//       </SimpleGrid>

//       {/* Modal: card grid with scroll */}
//       <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>내가 좋아하는 앨범 전체보기</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody maxH="80vh" overflowY="auto" sx={{ overscrollBehaviorY: "contain" }}>
//             <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
//               {albums.map((album) => (
//                 <VStack
//                   key={album.id}
//                   spacing={2}
//                   align="start"
//                   cursor="pointer"
//                   onClick={() => {
//                     onClose();
//                     navigate(`/review/${album.id}`);
//                   }}
//                 >
//                   <Image
//                     src={album.imagePath && `http://localhost:8084/${album.imagePath}`}
//                     alt={album.title}
//                     w="160px"
//                     h="160px"
//                     objectFit="cover"
//                     borderRadius="md"
//                     boxShadow="md"
//                   />
//                   <Text fontWeight="bold" noOfLines={1}>
//                     {album.title}
//                   </Text>

//                   {/* 아티스트: 이름별 클릭 이동 (모달) */}
//                   <Text fontSize="sm" color="gray.600" noOfLines={1}>
//                     {Array.isArray(album.artists) && album.artists.length > 0
//                       ? album.artists.map((a, i) => (
//                           <React.Fragment key={a.id ?? `${a.name}-${i}`}>
//                             <Text
//                               as="span"
//                               cursor="pointer"
//                               // textDecoration="underline"
//                               onClick={(e) => goArtist(e, a)}
//                               role="button"
//                               tabIndex={0}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter" || e.key === " ") goArtist(e, a);
//                               }}
//                               _hover={{
//                                 color: "black",
//                                 fontWeight: "medium",
//                               }}
//                             >
//                               {a.name}
//                             </Text>
//                             {i < album.artists.length - 1 && ", "}
//                           </React.Fragment>
//                         ))
//                       : album.artist}
//                   </Text>
//                 </VStack>
//               ))}
//             </SimpleGrid>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default LikedAlbums;
