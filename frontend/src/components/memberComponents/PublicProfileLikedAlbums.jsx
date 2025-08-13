// import {
//   Box,
//   Image,
//   Text,
//   VStack,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   useDisclosure,
//   SimpleGrid,
//   Flex,
// } from "@chakra-ui/react";
// import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import Slider from "react-slick";
// import { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const PublicProfileLikedAlbums = () => {
//   const sliderRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [albums, setAlbums] = useState([]);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // 모달 컨트롤
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   // 미리보기 개수
//   const previewCount = 8;
//   const slidesToShow = Math.min(previewCount, 6);
//   const slidesToScroll = 3;
//   const boxSize = 190;

//   useEffect(() => {
//     axios
//       .get(`/api/users/${id}/liked-albums`, { withCredentials: true })
//       .then((res) => {
//         const mapped = res.data.map((album) => ({
//           id: album.id,
//           imagePath: album.imagePath || album.coverImage || "",
//           title: album.title,
//           artist: album.artists ? album.artists.map((a) => a.name).join(", ") : "",
//         }));
//         setAlbums(mapped);
//       })
//       .catch((err) => {
//         console.error("다른 유저 좋아요 앨범 불러오기 실패:", err);
//       });
//   }, [id]);

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
//   const isLastSlide = currentIndex + slidesToShow >= Math.min(albums.length, previewCount);

//   // 카드 UI (슬라이더/Row 둘 다에서 씀)
//   const renderAlbumCard = (album, index) => (
//     <VStack spacing={2} align="start" w={`${boxSize}px`} key={album.id}>
//       <Box w={`${boxSize}px`} h={`${boxSize}px`}>
//         <Image
//           src={album.imagePath ? `http://localhost:8084/${album.imagePath.replace(/^\/+/, "")}` : ""}
//           alt={album.title}
//           w="100%"
//           h="100%"
//           objectFit="cover"
//           borderRadius="md"
//           boxShadow="md"
//         />
//       </Box>
//       <Text fontSize="sm" color="gray.500">
//         #{index + 1}
//       </Text>
//       <Text
//         fontSize="md"
//         fontWeight="semibold"
//         whiteSpace="normal"
//         noOfLines={2}
//         cursor="pointer"
//         onClick={() => navigate(`/review/${album.id}`)}
//       >
//         {album.title}
//       </Text>
//       <Text fontSize="md" color="gray.600" whiteSpace="normal">
//         {album.artist}
//       </Text>
//     </VStack>
//   );

//   return (
//     <Box maxW="1500px" px={4} py={8}>
//       {/* 헤더와 전체보기 버튼 */}
//       <Box display="flex" alignItems="center" mb={4}>
//         <Text fontSize="2xl" fontWeight="bold">
//           좋아요 표시한 앨범
//         </Text>
//         <Box flex="1" display="flex" justifyContent="flex-end">
//           {albums.length > previewCount && (
//             <Button size="sm" colorScheme="cyan" variant="outline" mr="25px" onClick={onOpen}>
//               전체보기
//             </Button>
//           )}
//         </Box>
//       </Box>

//       {/* 1~slidesToShow개: Row, 그 이상은 슬라이더 */}
//       {albums.slice(0, previewCount).length <= slidesToShow ? (
//         <Flex gap={3}>{albums.slice(0, previewCount).map((album, index) => renderAlbumCard(album, index))}</Flex>
//       ) : (
//         <Box position="relative">
//           {!isFirstSlide && (
//             <Box
//               position="absolute"
//               top="50%"
//               left="-70px"
//               transform="translateY(-50%)"
//               zIndex="999"
//               cursor="pointer"
//               onClick={() => sliderRef.current?.slickPrev()}
//               p={2}
//             >
//               <BsChevronLeft
//                 size={40}
//                 color="white"
//                 style={{
//                   filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
//                 }}
//               />
//             </Box>
//           )}
//           {!isLastSlide && (
//             <Box
//               position="absolute"
//               top="50%"
//               right="-70px"
//               transform="translateY(-50%)"
//               zIndex="999"
//               cursor="pointer"
//               onClick={() => sliderRef.current?.slickNext()}
//               p={2}
//             >
//               <BsChevronRight
//                 size={40}
//                 color="white"
//                 style={{
//                   filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
//                 }}
//               />
//             </Box>
//           )}

//           <Slider ref={sliderRef} {...settings}>
//             {albums.slice(0, previewCount).map((album, index) => (
//               <Box key={album.id} mr={index === previewCount - 1 ? 0 : 3}>
//                 {renderAlbumCard(album, index)}
//               </Box>
//             ))}
//           </Slider>
//         </Box>
//       )}

//       {/* 전체보기 모달 (카드 그리드) */}
//       <Modal isOpen={isOpen} onClose={onClose} size="5xl" zIndex="9999" isCentered scrollBehavior="inside">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>이 유저가 좋아하는 앨범 전체보기</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody maxH="80vh" overflowY="auto">
//             <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
//               {albums.map((album) => (
//                 <VStack
//                   key={album.id}
//                   cursor="pointer"
//                   align="start"
//                   onClick={() => {
//                     onClose();
//                     navigate(`/review/${album.id}`);
//                   }}
//                 >
//                   <Image
//                     src={album.imagePath ? `http://localhost:8084/${album.imagePath.replace(/^\/+/, "")}` : ""}
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

// export default PublicProfileLikedAlbums;

import {
  Box,
  Image,
  Text,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PublicProfileLikedAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const previewCount = 4;
  const boxSize = 210;

  useEffect(() => {
    axios
      .get(`/api/users/${id}/liked-albums`, { withCredentials: true })
      .then((res) => {
        const mapped = res.data.map((album) => ({
          id: album.id,
          imagePath: album.imagePath || album.coverImage || "",
          title: album.title,
          artist: album.artists ? album.artists.map((a) => a.name).join(", ") : "",
        }));
        setAlbums(mapped);
      })
      .catch((err) => {
        console.error("다른 유저 좋아요 앨범 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (albums.length === 0) return <Box ml="190px">좋아요 표시한 앨범이 없습니다.</Box>;

  return (
    <Box maxW="650px" mx="auto" px={4} py={8}>
      {/* 헤더와 전체보기 버튼 */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          좋아요 표시한 앨범
        </Text>
        {albums.length > previewCount && (
          <Button size="sm" colorScheme="cyan" variant="outline" mr="74px" onClick={onOpen}>
            전체보기
          </Button>
        )}
      </Box>

      {/* 2x2 그리드 미리보기 (이미지만) */}
      <SimpleGrid columns={2} spacing={8}>
        {albums.slice(0, previewCount).map((album) => (
          <Box
            key={album.id}
            w={`${boxSize}px`}
            h={`${boxSize}px`}
            cursor="pointer"
            onClick={() => navigate(`/review/${album.id}`)}
          >
            <Image
              src={album.imagePath ? `http://localhost:8084/${album.imagePath.replace(/^\/+/, "")}` : ""}
              alt={album.title}
              w="100%"
              h="100%"
              objectFit="cover"
              borderRadius="md"
              boxShadow="md"
            />
          </Box>
        ))}
      </SimpleGrid>

      {/* 전체보기 모달 (카드 그리드, 상세정보 다 보여줌) */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" zIndex="9999" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>이 유저가 좋아하는 앨범 전체보기</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="80vh" overflowY="auto" sx={{ overscrollBehaviorY: "contain" }}>
            <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
              {albums.map((album) => (
                <VStack
                  key={album.id}
                  cursor="pointer"
                  align="start"
                  onClick={() => {
                    onClose();
                    navigate(`/review/${album.id}`);
                  }}
                >
                  <Image
                    src={album.imagePath ? `http://localhost:8084/${album.imagePath.replace(/^\/+/, "")}` : ""}
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
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {album.artist}
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

export default PublicProfileLikedAlbums;
