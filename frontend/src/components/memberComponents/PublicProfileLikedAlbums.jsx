import { Box, Image, SimpleGrid, Spinner, Center, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PublicProfileLikedAlbums = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

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
        }));
        setAlbums(mapped);
      })
      .catch((err) => {
        console.error("다른 유저 좋아요 앨범 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    );
  }

  if (albums.length === 0) {
    return (
      <Box py={8}>
        <Text>좋아요 표시한 앨범이 없습니다.</Text>
      </Box>
    );
  }

  const preview = albums.slice(0, previewCount);

  // 미리보기(2×2) 이미지만
  return (
    <SimpleGrid columns={2} spacing={8}>
      {preview.map((album) => (
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
  );
};

export default PublicProfileLikedAlbums;
