import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Image,
  Text,
  VStack,
  Input,
  Checkbox,
  Collapse,
  useDisclosure,
  Icon,
  HStack,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Spinner,
  Center,
  AspectRatio,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Slider from "react-slick";

const ReviewGrid = () => {
  const { state, isLoading } = useUser();
  const [reviews, setReviews] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
    axios.get("/api/reviews?page=0").then((res) => setReviews(res.data.content));
    axios.get("/api/artists").then((res) => setArtists(res.data.content || res.data));
  }, []);

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName]
    );
  };

  const filteredReviews = reviews.filter((r) => {
    const matchTitle = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.every((selected) => r.categories?.some((c) => c.categoryName === selected));
    return matchTitle && matchCategory;
  });

  const filteredArtists = artists.filter((a) => {
    const matchName = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.every((selected) => a.categories?.some((c) => c.categoryName === selected));
    return matchName && matchCategory;
  });

  // const filteredArtists = artists.filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" />
        <Text ml={4}>로딩 중...</Text>
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <Tabs variant="enclosed">
        <TabList mb={4}>
          <Tab>앨범</Tab>
          <Tab>아티스트</Tab>
        </TabList>

        <TabPanels>
          {/* 앨범 탭 */}
          <TabPanel>
            {state?.roleName === "ADMIN" && (
              <Box textAlign="right" mb={4}>
                <Button colorScheme="blue" onClick={() => navigate("/review/create")}>
                  리뷰 작성
                </Button>
              </Box>
            )}

            <TopRankedAlbums />

            <Input
              placeholder="앨범 제목으로 검색"
              mb={6}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <HStack spacing={2} mb={2} cursor="pointer" onClick={onToggle}>
              <Text fontWeight="bold">카테고리 필터</Text>
              <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
            </HStack>

            <Collapse in={isOpen} animateOpacity>
              <SimpleGrid columns={[2, 3, 4]} spacing={2} mb={4}>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    isChecked={selectedCategories.includes(category.categoryName)}
                    onChange={() => handleCategoryToggle(category.categoryName)}
                  >
                    {category.categoryName}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Collapse>

            <Divider my={6} borderColor="black" />

            {filteredReviews.length === 0 ? (
              <Text>검색된 결과가 없습니다.</Text>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
                {filteredReviews.map((r) => (
                  <Box
                    key={r.id}
                    borderWidth="1px"
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                    cursor="pointer"
                    onClick={() => navigate(`/review/${r.id}`)}
                  >
                    <AspectRatio ratio={1} w="100%">
                      <Image
                        src={r.imagePath ? `http://localhost:8084/${r.imagePath}` : ""}
                        alt={r.title}
                        objectFit="cover"
                      />
                    </AspectRatio>
                    <VStack align="start" spacing={1} p={3}>
                      <Box>
                        {r.artists?.map((a) => (
                          <Text
                            key={a.id}
                            fontWeight="bold"
                            color="gray.600"
                            cursor="pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/artist/${a.id}`);
                            }}
                          >
                            {a.name}
                          </Text>
                        ))}
                      </Box>
                      <Text fontSize="sm">
                        평균별점: {typeof r.averageStarPoint === "number" ? r.averageStarPoint.toFixed(1) : "0.0"}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </TabPanel>

          {/* 아티스트 탭 */}
          <TabPanel>
            <Input
              placeholder="아티스트 이름으로 검색"
              mb={6}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <HStack spacing={2} mb={2} cursor="pointer" onClick={onToggle}>
              <Text fontWeight="bold">카테고리 필터</Text>
              <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
            </HStack>

            <Collapse in={isOpen} animateOpacity>
              <SimpleGrid columns={[2, 3, 4]} spacing={2} mb={4}>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    isChecked={selectedCategories.includes(category.categoryName)}
                    onChange={() => handleCategoryToggle(category.categoryName)}
                  >
                    {category.categoryName}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Collapse>

            <Divider my={6} borderColor="black" />

            <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={6}>
              {filteredArtists.map((artist) => (
                <Box
                  key={artist.id}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                  cursor="pointer"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <AspectRatio ratio={1}>
                    <Image
                      src={artist.imagePath ? `http://localhost:8084/${artist.imagePath}` : ""}
                      alt={artist.name}
                      objectFit="cover"
                    />
                  </AspectRatio>
                  <Box p={3}>
                    <Text fontWeight="bold">{artist.name}</Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ReviewGrid;

// ✅ 상단 앨범 슬라이더 컴포넌트
const TopRankedAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/reviews/top-albums")
      .then((res) => setAlbums(res.data))
      .catch((err) => console.error("Top10 불러오기 실패:", err));
  }, []);

  const slidesToShow = 6.5;
  const slidesToScroll = 3.5;
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    arrows: false,
    afterChange: (idx) => setCurrentIndex(idx),
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex + slidesToShow >= albums.length;
  const boxSize = 160;

  return (
    <Box maxW="1500px" mx="auto" px={4} py={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Top Ranked Albums
      </Text>

      <Box position="relative">
        {!isFirst && (
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
            <BsChevronLeft size={40} color="white" style={{ filter: "drop-shadow(0 0 6px #888)" }} />
          </Box>
        )}

        {!isLast && (
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
            <BsChevronRight size={40} color="white" style={{ filter: "drop-shadow(0 0 6px #888)" }} />
          </Box>
        )}

        <Slider ref={sliderRef} {...settings}>
          {albums.map((a, i) => (
            <Box key={a.id} mr={i === albums.length - 1 ? 0 : 4}>
              <VStack spacing={2} align="start" w={`${boxSize}px`}>
                <Box w={`${boxSize}px`} h={`${boxSize}px`}>
                  <Image
                    src={a.imagePath ? `http://localhost:8084/${a.imagePath}` : ""}
                    alt={a.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="md"
                    boxShadow="md"
                    cursor="pointer"
                    onClick={() => navigate(`/review/${a.id}`)}
                  />
                </Box>
                <Text fontSize="2xl" color="gray.600" fontWeight="bold">
                  #{i + 1}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  whiteSpace="normal"
                  cursor="pointer"
                  onClick={() => navigate(`/review/${a.id}`)}
                >
                  {a.title}
                </Text>
                <Text fontSize="md" color="gray.600" whiteSpace="normal">
                  {a.artists.map((ar) => ar.name).join(", ")}
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};
