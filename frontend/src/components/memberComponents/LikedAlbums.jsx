// src/components/memberComponents/LikedAlbums.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Image,
  Text,
  VStack,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LikedAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
      </Box>
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
    <Box maxW="650px" mx="auto" px={4} py={8}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          내가 좋아하는 앨범
        </Text>
        {albums.length > previewCount && (
          <Button size="sm" variant="outline" colorScheme="cyan" onClick={onOpen}>
            전체보기
          </Button>
        )}
      </Box>

      {/* Preview grid (2x2) */}
      <SimpleGrid columns={2} spacing={4} mb={4}>
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

            {/* 아티스트: 이름별 클릭 이동 */}
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {Array.isArray(album.artists) && album.artists.length > 0
                ? album.artists.map((a, i) => (
                    <React.Fragment key={a.id ?? `${a.name}-${i}`}>
                      <Text
                        as="span"
                        cursor="pointer"
                        // textDecoration="underline"
                        onClick={(e) => goArtist(e, a)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") goArtist(e, a);
                        }}
                        _hover={{
                          color: "black",
                          fontWeight: "medium",
                        }}
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

      {/* Modal: card grid with scroll */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>내가 좋아하는 앨범 전체보기</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="80vh" overflowY="auto" sx={{ overscrollBehaviorY: "contain" }}>
            <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
              {albums.map((album) => (
                <VStack
                  key={album.id}
                  spacing={2}
                  align="start"
                  cursor="pointer"
                  onClick={() => {
                    onClose();
                    navigate(`/review/${album.id}`);
                  }}
                >
                  <Image
                    src={album.imagePath && `http://localhost:8084/${album.imagePath}`}
                    alt={album.title}
                    w="160px"
                    h="160px"
                    objectFit="cover"
                    borderRadius="md"
                    boxShadow="md"
                  />
                  <Text fontWeight="bold" noOfLines={1}>
                    {album.title}
                  </Text>

                  {/* 아티스트: 이름별 클릭 이동 (모달) */}
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {Array.isArray(album.artists) && album.artists.length > 0
                      ? album.artists.map((a, i) => (
                          <React.Fragment key={a.id ?? `${a.name}-${i}`}>
                            <Text
                              as="span"
                              cursor="pointer"
                              // textDecoration="underline"
                              onClick={(e) => goArtist(e, a)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") goArtist(e, a);
                              }}
                              _hover={{
                                color: "black",
                                fontWeight: "medium",
                              }}
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LikedAlbums;

// // src/components/memberComponents/LikedAlbums.jsx
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
//         const mapped = res.data.map((album) => ({
//           id: album.id,
//           imagePath: album.imagePath || album.coverImage || "",
//           title: album.title,
//           artist: album.artists?.map((a) => a.name).join(", ") || "",
//         }));
//         setAlbums(mapped);
//       })
//       .catch((err) => console.error("좋아요 앨범 불러오기 실패:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <Box textAlign="center" py={8}>
//         <Spinner size="lg" />
//       </Box>
//     );
//   }
//   if (loading) return <Spinner />;
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
//         <Text fontSize="2xl" fontWeight="bold">
//           내가 좋아하는 앨범
//         </Text>
//         {albums.length > previewCount && (
//           <Button size="sm" variant="outline" colorScheme="cyan" onClick={onOpen}>
//             전체보기
//           </Button>
//         )}
//       </Box>

//       {/* Preview grid (2x2) */}
//       <SimpleGrid columns={2} spacing={4} mb={4}>
//         {/* {preview.map((album, idx) => ( */}
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
//             {/* <Text fontSize="sm" color="gray.500">
//               #{idx + 1}
//             </Text> */}
//             <Text
//               fontSize="md"
//               fontWeight="semibold"
//               noOfLines={2}
//               cursor="pointer"
//               onClick={() => navigate(`/review/${album.id}`)}
//               _hover={{
//                 fontWeight: "bold",
//               }}
//             >
//               {album.title}
//             </Text>
//             <Text fontSize="sm" color="gray.600" noOfLines={1}>
//               {album.artist}
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
//           <ModalBody maxH="80vh" overflowY="auto">
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
//                   <Text fontSize="sm" color="gray.600" noOfLines={1}>
//                     {album.artist}
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

// import { Box, Image, Text, VStack } from "@chakra-ui/react";
// import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import Slider from "react-slick";
// import { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LikedAlbums = () => {
//   const sliderRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [albums, setAlbums] = useState([]);
//   const navigate = useNavigate();

//   const slidesToShow = 6.5;
//   const slidesToScroll = 3.5;

//   useEffect(() => {
//     axios
//       .get("/api/member/liked-albums", { withCredentials: true })
//       .then((res) => {
//         // imagePath 필드로 통일!
//         const mapped = res.data.map((album) => ({
//           id: album.id,
//           imagePath: album.imagePath || album.coverImage, // 무조건 imagePath 사용
//           title: album.title,
//           artist: album.artists ? album.artists.map((a) => a.name).join(", ") : "",
//         }));
//         setAlbums(mapped);
//       })
//       .catch((err) => {
//         console.error("좋아요 앨범 불러오기 실패:", err);
//       });
//   }, []);

//   const settings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll,
//     arrows: false,
//     afterChange: (index) => setCurrentIndex(index),
//   };

//   const isFirstSlide = currentIndex === 0;
//   const isLastSlide = currentIndex + slidesToShow >= albums.length;

//   const boxSize = 210;

//   return (
//     <Box maxW="1500px" mx="auto" px={4} py={8}>
//       <Text fontSize="2xl" fontWeight="bold" mb={4}>
//         내가 좋아하는 앨범
//       </Text>

//       <Box position="relative">
//         {!isFirstSlide && (
//           <Box
//             position="absolute"
//             top="50%"
//             left="-70px"
//             transform="translateY(-50%)"
//             zIndex="999"
//             cursor="pointer"
//             onClick={() => sliderRef.current?.slickPrev()}
//             p={2}
//           >
//             <BsChevronLeft
//               size={40}
//               color="white"
//               style={{
//                 filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
//               }}
//             />
//           </Box>
//         )}

//         {!isLastSlide && (
//           <Box
//             position="absolute"
//             top="50%"
//             right="-70px"
//             transform="translateY(-50%)"
//             zIndex="999"
//             cursor="pointer"
//             onClick={() => sliderRef.current?.slickNext()}
//             p={2}
//           >
//             <BsChevronRight
//               size={40}
//               color="white"
//               style={{
//                 filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
//               }}
//             />
//           </Box>
//         )}

//         <Slider ref={sliderRef} {...settings}>
//           {albums.map((album, index) => (
//             <Box key={album.id} mr={index === albums.length - 1 ? 0 : 4}>
//               <VStack spacing={2} align="start" w={`${boxSize}px`}>
//                 <Box w={`${boxSize}px`} h={`${boxSize}px`}>
//                   <Image
//                     // src={album.coverImage}
//                     src={album.imagePath ? `http://localhost:8084/${album.imagePath}` : ""}
//                     alt={album.title}
//                     w="100%"
//                     h="100%"
//                     objectFit="cover"
//                     borderRadius="md"
//                     boxShadow="md"
//                   />
//                 </Box>
//                 <Text fontSize="sm" color="gray.500">
//                   #{index + 1}
//                 </Text>
//                 <Text
//                   fontSize="md"
//                   fontWeight="semibold"
//                   whiteSpace="normal"
//                   noOfLines={2}
//                   cursor="pointer"
//                   onClick={() => navigate(`/review/${album.id}`)}
//                 >
//                   {album.title}
//                 </Text>
//                 <Text fontSize="md" color="gray.600" whiteSpace="normal">
//                   {album.artist}
//                 </Text>
//                 {/* <Text fontSize="sm">평균별점: {album.averageStarPoint.toFixed(1)}</Text> */}
//               </VStack>
//             </Box>
//           ))}
//         </Slider>
//       </Box>
//     </Box>
//   );
// };

// export default LikedAlbums;
