import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import { useRef, useState } from "react";

const mockAlbums = [
  { id: 1, title: "This is a very long album title", artist: "Famous Artist", coverImage: "/images/albums/album1.jpg" },
  { id: 2, title: "Another Album Title", artist: "Another Artist", coverImage: "/images/albums/album2.jpg" },
  { id: 3, title: "Midnight Journey to Mars", artist: "Cosmic Voyager", coverImage: "/images/albums/album3.jpg" },
  { id: 4, title: "Summer Sunset", artist: "Sunwave", coverImage: "/images/albums/album4.jpg" },
  { id: 5, title: "Neon Streets", artist: "City Lights", coverImage: "/images/albums/album5.jpg" },
  { id: 6, title: "Calm Before the Storm", artist: "Ocean Deep", coverImage: "/images/albums/album6.jpg" },
  { id: 7, title: "Dreamscape", artist: "Lucid", coverImage: "/images/albums/album7.jpg" },
  { id: 8, title: "Electric Pulse", artist: "Volt", coverImage: "/images/albums/album8.jpg" },
  { id: 9, title: "Lost in Echoes", artist: "Shadow Sound", coverImage: "/images/albums/album9.jpg" },
  { id: 10, title: "Aurora Lights", artist: "North Glow", coverImage: "/images/albums/album10.jpg" },
];

const TopRankedAlbums = ({ albums = mockAlbums }) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slidesToShow = 6.5;
  const slidesToScroll = 3.5;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    arrows: false,
    afterChange: (index) => setCurrentIndex(index),
  };

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex + slidesToShow >= albums.length;

  const boxSize = 210;

  return (
    <Box maxW="1500px" mx="auto" px={4} py={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Top Ranked Albums
      </Text>

      <Box position="relative">
        {!isFirstSlide && (
          <Box
            position="absolute"
            top="50%"
            left="-70px"
            transform="translateY(-50%)"
            zIndex="999"
            cursor="pointer"
            onClick={() => sliderRef.current?.slickPrev()}
            p={2}
          >
            <BsChevronLeft
              size={40}
              color="white"
              style={{
                filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
              }}
            />
          </Box>
        )}

        {!isLastSlide && (
          <Box
            position="absolute"
            top="50%"
            right="-70px"
            transform="translateY(-50%)"
            zIndex="999"
            cursor="pointer"
            onClick={() => sliderRef.current?.slickNext()}
            p={2}
          >
            <BsChevronRight
              size={40}
              color="white"
              style={{
                filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
              }}
            />
          </Box>
        )}

        <Slider ref={sliderRef} {...settings}>
          {albums.map((album, index) => (
            <Box key={album.id} mr={index === albums.length - 1 ? 0 : 4}>
              <VStack spacing={2} align="start" w={`${boxSize}px`}>
                <Box w={`${boxSize}px`} h={`${boxSize}px`}>
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="md"
                    boxShadow="md"
                  />
                </Box>
                <Text fontSize="2xl" color="gray.600" fontWeight="bold">
                  #{index + 1}
                </Text>
                <Text fontSize="lg" fontWeight="semibold" whiteSpace="normal">
                  {album.title}
                </Text>
                <Text fontSize="md" color="gray.600" whiteSpace="normal">
                  {album.artist}
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default TopRankedAlbums;
