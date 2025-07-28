import React, { useEffect, useState, useRef } from "react";
import { Box, Input, IconButton, Portal, VStack, Text, Spinner, Image, Flex } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8084";

const SearchNavbar = ({ isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // 리뷰 전체 불러오기
  useEffect(() => {
    if (isVisible) {
      setSearchTerm("");
      setFiltered([]);
      setLoading(true);
      axios
        .get("/api/reviews?page=0")
        .then((res) => setReviews(res.data.content || []))
        .catch((err) => console.error("리뷰 불러오기 실패:", err))
        .finally(() => {
          setLoading(false);
          setTimeout(() => {
            inputRef.current?.focus(); // 자동 포커싱
          }, 0);
        });
    }
  }, [isVisible]);

  // 검색어에 따라 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFiltered([]);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const matches = reviews.filter((r) => {
      const titleMatch = r.title.toLowerCase().includes(lower);
      const artistMatch = r.artists?.some((a) => a.name.toLowerCase().includes(lower));
      return titleMatch || artistMatch;
    });

    setFiltered(matches);
  }, [searchTerm, reviews]);

  if (!isVisible) return null;

  return (
    <Portal>
      {/* 오버레이 */}
      <Box position="fixed" top="0" left="0" w="100vw" h="100vh" bg="blackAlpha.700" zIndex="10000" onClick={onClose} />

      {/* 검색바 */}
      <Box position="fixed" top="0" left="0" w="100%" bg="black" px={8} py={6} zIndex="10001">
        <Box position="relative" maxW="500px" mx="auto">
          <Input
            ref={inputRef}
            placeholder="Search..."
            w="100%"
            bg="white"
            color="black"
            borderColor="black"
            borderWidth="1px"
            borderRadius="md"
            pr="3rem"
            _focus={{ boxShadow: "none", borderColor: "black" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
          />
          <IconButton
            aria-label="Close Search"
            icon={<CloseIcon />}
            variant="ghost"
            color="black"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            right="8px"
            size="sm"
            zIndex="10002"
            _hover={{ bg: "transparent" }}
            onClick={onClose}
          />
        </Box>
      </Box>

      {/* 검색 결과 */}
      {searchTerm.trim() && (
        <Box
          position="fixed"
          top="100px"
          left="50%"
          transform="translateX(-50%)"
          maxW="600px"
          w="90%"
          maxHeight="70vh"
          overflowY="auto"
          zIndex="10001"
          bg="white"
          borderRadius="md"
          boxShadow="lg"
          px={3}
          py={2}
        >
          {loading ? (
            <Box textAlign="center" py={6}>
              <Spinner />
            </Box>
          ) : filtered.length === 0 ? (
            <Box textAlign="center" py={6} color="gray.500" fontSize="sm">
              검색 결과가 없습니다.
            </Box>
          ) : (
            <VStack align="stretch" spacing={2}>
              {filtered.map((r) => (
                <Flex
                  key={r.id}
                  p={2}
                  align="center"
                  gap={3}
                  bg="gray.50"
                  borderRadius="md"
                  _hover={{ bg: "purple.50" }}
                  cursor="pointer"
                  onClick={() => {
                    navigate(`/review/${r.id}`);
                    onClose();
                  }}
                >
                  <Image
                    src={r.imagePath ? `${BACKEND_URL}/${r.imagePath}` : ""}
                    alt={r.title}
                    boxSize="45px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                      {r.title}
                    </Text>
                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {r.artists?.map((a) => a.name).join(", ") || "정보 없음"}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Portal>
  );
};

export default SearchNavbar;
