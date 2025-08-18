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
  ButtonGroup,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/redux/useUser.js";
import Slider from "react-slick";
import Pagination from "../ui/Pagination";

const ReviewGrid = () => {
  const { state, isLoading } = useUser();
  const [reviews, setReviews] = useState([]);
  const [artists, setArtists] = useState([]);

  // 입력값과, 서버에 실제로 보낼 확정 검색어(탭별)
  const [searchTerm, setSearchTerm] = useState("");
  const [committedAlbumSearch, setCommittedAlbumSearch] = useState("");
  const [committedArtistSearch, setCommittedArtistSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  // 탭 상태
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTabIndex = queryParams.get("tab") === "artist" ? 1 : 0;
  const [tabIndex, setTabIndex] = useState(initialTabIndex);

  // 페이지 상태
  const [albumPage, setAlbumPage] = useState(0);
  const [artistPage, setArtistPage] = useState(0);
  const [albumTotalPages, setAlbumTotalPages] = useState(1);
  const [artistTotalPages, setArtistTotalPages] = useState(1);

  const [albumLoading, _setAlbumLoading] = useState(false);

  const [sort, setSort] = useState("latest");

  // 검색 실행(버튼/Enter)
  const onClickSearch = () => {
    const q = searchTerm.trim();
    if (tabIndex === 0) {
      setAlbumPage(0);
      setCommittedAlbumSearch(q); // 앨범 서버 검색
    } else {
      setArtistPage(0);
      setCommittedArtistSearch(q); // 아티스트 서버 검색
    }
  };

  // 카테고리 목록
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  // 앨범 목록(서버 검색 + 카테고리 + 페이지)
  useEffect(() => {
    const params = new URLSearchParams();
    params.append("page", albumPage);
    params.append("sort", sort);
    if (committedAlbumSearch) params.append("search", committedAlbumSearch);
    selectedCategories.forEach((c) => params.append("categories", c)); // 서버가 이름 기반이라면 그대로 사용

    axios
      .get(`/api/reviews?${params.toString()}`)
      .then((res) => {
        setReviews(res.data.content ?? []);
        setAlbumTotalPages(res.data.totalPages ?? 1);
      })
      .catch((err) => {
        console.error("리뷰 요청 에러:", err);
        setReviews([]);
        setAlbumTotalPages(1);
      });
  }, [albumPage, committedAlbumSearch, selectedCategories, sort]);

  // 아티스트 목록(서버 검색 + 카테고리 + 페이지)
  useEffect(() => {
    const params = new URLSearchParams();
    params.append("page", artistPage);
    if (committedArtistSearch) params.append("search", committedArtistSearch);
    selectedCategories.forEach((c) => params.append("categories", c));

    axios
      .get(`/api/artists?${params.toString()}`)
      .then((res) => {
        setArtists(res.data.content ?? []);
        setArtistTotalPages(res.data.totalPages ?? 1);
      })
      .catch((err) => {
        console.error("아티스트 요청 에러:", err);
        setArtists([]);
        setArtistTotalPages(1);
      });
  }, [artistPage, committedArtistSearch, selectedCategories]);

  // 카테고리 변경 시 페이지 초기화
  useEffect(() => {
    setAlbumPage(0);
    setArtistPage(0);
  }, [selectedCategories]);

  // 탭 변경 시 초기화
  useEffect(() => {
    setSearchTerm("");
    setCommittedAlbumSearch("");
    setCommittedArtistSearch("");
    setSelectedCategories([]);
    setAlbumPage(0);
    setArtistPage(0);
  }, [tabIndex]);

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName]
    );
  };

  // 이미지 로딩 효과
  const [imageLoaded, setImageLoaded] = useState({});

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
      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed">
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

            <Flex
              mb={6}
              align="center"
              gap={4}
              // 모바일에선 세로, md↑에선 가로 배치
              direction={{ base: "column", md: "row" }}
              justify="space-between"
            >
              {/* 왼쪽: 최신순 / 인기순 */}
              <ButtonGroup isAttached size="sm">
                <Button
                  variant={sort === "latest" ? "solid" : "outline"}
                  onClick={() => {
                    setSort("latest");
                    setAlbumPage(0);
                  }}
                >
                  최신순
                </Button>
                <Button
                  variant={sort === "popular" ? "solid" : "outline"}
                  onClick={() => {
                    setSort("popular");
                    setAlbumPage(0);
                  }}
                >
                  별점순
                </Button>
              </ButtonGroup>

              {/* 오른쪽: 검색 입력 + 버튼들 */}
              <HStack spacing={3} w={{ base: "100%", md: "auto" }}>
                <Input
                  placeholder="앨범 제목으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onClickSearch()}
                  // 모바일에선 꽉 차게, 데스크톱에선 적당한 폭
                  w={{ base: "100%", md: "360px" }}
                />
                <Button colorScheme="blue" onClick={onClickSearch} isLoading={albumLoading}>
                  검색
                </Button>
                {committedAlbumSearch && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCommittedAlbumSearch("");
                      setAlbumPage(0);
                    }}
                  >
                    검색 초기화
                  </Button>
                )}
              </HStack>
            </Flex>
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

            {reviews.length === 0 ? (
              <Text>
                {committedAlbumSearch ? `"${committedAlbumSearch}"에 대한 결과가 없습니다.` : "검색된 결과가 없습니다."}
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
                {reviews.map((r) => (
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
                        transition="opacity 0.6s ease"
                        opacity={imageLoaded[r.id] ? 1 : 0}
                        onLoad={() =>
                          setImageLoaded((prev) => ({
                            ...prev,
                            [r.id]: true,
                          }))
                        }
                      />
                    </AspectRatio>
                    <VStack align="start" spacing={1} p={3}>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.600"
                        cursor="pointer"
                        onClick={() => navigate(`/review/${r.id}`)}
                      >
                        {r.title}
                      </Text>
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
            <Pagination
              currentPage={albumPage}
              totalPages={albumTotalPages}
              onPageChange={(page) => setAlbumPage(page)}
            />
          </TabPanel>

          {/* 아티스트 탭 */}
          <TabPanel>
            <HStack mb={6}>
              <Input
                placeholder="아티스트 이름으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onClickSearch()}
              />
              <Button colorScheme="blue" onClick={onClickSearch} isLoading={albumLoading}>
                검색
              </Button>
              {committedAlbumSearch && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCommittedAlbumSearch("");
                    setAlbumPage(0);
                  }}
                >
                  검색 초기화
                </Button>
              )}
            </HStack>
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
              {artists.map((artist) => (
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
                      transition="opacity 0.4s ease"
                      opacity={imageLoaded[artist.id] ? 1 : 0}
                      onLoad={() =>
                        setImageLoaded((prev) => ({
                          ...prev,
                          [artist.id]: true,
                        }))
                      }
                    />
                  </AspectRatio>
                  <Box p={3}>
                    <Text fontWeight="bold">{artist.name}</Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>

            {tabIndex === 1 && artists.length > 0 && (
              <Box textAlign="center" mt={8}>
                <HStack justify="center" spacing={4}>
                  <Button
                    onClick={() => setArtistPage((prev) => Math.max(prev - 1, 0))}
                    isDisabled={artistPage === 0}
                    leftIcon={<BsChevronLeft />}
                  >
                    이전
                  </Button>
                  <Text fontWeight="bold">
                    {artistPage + 1} / {artistTotalPages}
                  </Text>
                  <Button
                    onClick={() => setArtistPage((prev) => Math.min(prev + 1, artistTotalPages - 1))}
                    isDisabled={artistPage >= artistTotalPages - 1}
                    rightIcon={<BsChevronRight />}
                  >
                    다음
                  </Button>
                </HStack>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ReviewGrid;

// ✅ 상단 앨범 슬라이더 (변경 없음)
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
            <Box key={a.id || `album-${i}`} mr={i === albums.length - 1 ? 0 : 4}>
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
