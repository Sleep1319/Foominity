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
  // 모달 컨트롤
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // 미리보기 개수
  const previewCount = 4;
  const boxSize = 174;

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
          <ModalBody maxH="80vh" overflowY="auto">
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
