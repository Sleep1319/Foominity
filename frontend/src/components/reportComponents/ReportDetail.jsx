// ReportDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Button,
  Spinner,
  useToast,
  Flex,
  Divider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  AspectRatio,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@/redux/useUser.js";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick"; // ✅ 슬라이더

const getTypeLabel = (type) => {
  switch (type) {
    case "REPORT":
      return "신고";
    case "INQUIRY":
      return "문의";
    case "REQUEST":
      return "요청";
    case "SUGGESTION":
      return "건의";
    default:
      return "기타";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "대기 중";
    case "IN_PROGRESS":
      return "처리 중";
    case "RESOLVED":
      return "처리 완료";
    case "REJECTED":
      return "거절됨";
    default:
      return "알수없음";
  }
};

const getTargetTypeLabel = (targetType) => {
  switch (targetType) {
    case "BOARD":
      return "자유게시판";
    case "REVIEW":
      return "리뷰게시판";
    default:
      return targetType || "-";
  }
};

const getTypeBadgeColor = (type) => {
  switch (type) {
    case "REPORT":
      return "red";
    case "INQUIRY":
      return "blue";
    case "REQUEST":
      return "purple";
    case "SUGGESTION":
      return "green";
    default:
      return "gray";
  }
};

const BACKEND_BASE = "http://localhost:8084";
const toImageUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${BACKEND_BASE}${path}`;
};

const statusOptions = [
  { value: "PENDING", label: "대기 중" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "RESOLVED", label: "처리 완료" },
  { value: "REJECTED", label: "거절됨" },
];

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const toast = useToast();
  const { state: user } = useUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  // 라이트박스
  const [previewIdx, setPreviewIdx] = useState(null);
  const { isOpen: isImgOpen, onOpen: onImgOpen, onClose: onImgClose } = useDisclosure();

  // 슬라이드
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/report/${id}`, { withCredentials: true });
      toast({ title: "게시물 삭제 완료", status: "success", duration: 2000, isClosable: true });
      navigate("/report");
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/api/report/${id}`, { withCredentials: true });
        setReport(res.data);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        toast({ title: "글 조회 실패", description: message, status: "error", duration: 3000, isClosable: true });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${h}:${m}`;
  };

  const handleStatusSelect = async (selectedStatus) => {
    setStatusLoading(true);
    try {
      await axios.put(`/api/report/${id}/status`, { status: selectedStatus }, { withCredentials: true });
      setReport((prev) => ({ ...prev, status: selectedStatus }));
      toast({ title: "상태가 변경되었습니다.", status: "success", duration: 1500, isClosable: true });
    } catch (error) {
      toast({
        title: "상태 변경 실패",
        description: error.response?.data?.message || "오류가 발생했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!report) return null;

  const typeLabel = getTypeLabel(report.type);
  const imagePaths = Array.isArray(report.imagePaths) ? report.imagePaths : [];

  // react-slick 설정
  const sliderSettings = {
    dots: true,
    infinite: imagePaths.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // 커스텀 화살표 사용
    adaptiveHeight: true,
    afterChange: (idx) => setCurrentSlide(idx),
  };

  return (
    <Box p={8} maxW="900px" mx="auto" mt="120px" bg="white">
      {/* 제목 + 유형 배지 */}
      <Flex align="center" gap={3} mb={4} wrap="wrap">
        <Badge colorScheme={getTypeBadgeColor(report.type)} px={2} py={1} borderRadius="full" fontSize="sm">
          {typeLabel}
        </Badge>
        <Text fontSize="3xl" fontWeight="bold">
          {report.title}
        </Text>
      </Flex>

      <Flex align="center" justify="space-between" mb={2}>
        <Text fontSize="sm">
          <Text as="span" fontWeight="semibold">
            {report.nickname}
          </Text>{" "}
          <Text as="span" color="gray.500">
            | {formatDate(report.createdDate)}
          </Text>
        </Text>

        <Box>
          {user?.roleName === "ADMIN" ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="sm"
                isLoading={statusLoading}
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                fontWeight="semibold"
                borderRadius="999px"
              >
                {statusOptions.find((opt) => opt.value === report.status)?.label || "상태 선택"}
              </MenuButton>
              <MenuList>
                {statusOptions.map(({ value, label }) => (
                  <MenuItem key={value} onClick={() => handleStatusSelect(value)}>
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <Text
              fontSize="sm"
              px={4}
              py={1}
              bg="black"
              color="white"
              borderRadius="full"
              fontWeight="bold"
              display="inline-block"
              minWidth="70px"
              textAlign="center"
            >
              {getStatusLabel(report.status)}
            </Text>
          )}
        </Box>
      </Flex>

      {/* 신고글일 때만 표시 */}
      {report.type === "REPORT" && (
        <>
          <Divider my={4} />
          <Flex mb={4}>
            <Text fontWeight="semibold" minW="100px">
              게시판
            </Text>
            <Text>{getTargetTypeLabel(report.targetType)}</Text>
          </Flex>
        </>
      )}

      <Divider my={4} />

      {/* 본문 */}
      <Box mb={8}>
        <Text whiteSpace="pre-wrap" lineHeight="1.9" fontSize="md">
          {report.reason}
        </Text>
      </Box>

      {/* 첨부 이미지 슬라이더 */}
      {imagePaths.length > 0 && (
        <Box
          position="relative"
          mb={10}
          maxW={{ base: "100%", md: "560px" }} // ✅ 더 작게
          w="100%"
          ml={0} // ✅ 왼쪽 정렬 고정
          sx={{
            ".slick-list": { padding: "0 !important", margin: "0 !important" }, // ✅ 래퍼 여백 제거
            ".slick-track": { margin: "0 !important" },
            ".slick-slide > div": { padding: "0 !important", margin: "0 !important" },
          }}
        >
          <Slider ref={sliderRef} {...sliderSettings}>
            {imagePaths.map((p, idx) => {
              const url = toImageUrl(p);
              return (
                <Box key={`${p}-${idx}`}>
                  <AspectRatio ratio={4 / 3}>
                    <Skeleton isLoaded>
                      <Image
                        src={url}
                        alt={`report-image-${idx}`}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        draggable={false}
                        cursor="zoom-in"
                        onClick={() => {
                          setPreviewIdx(idx);
                          onImgOpen();
                        }}
                      />
                    </Skeleton>
                  </AspectRatio>
                </Box>
              );
            })}
          </Slider>

          {/* 좌/우 화살표 */}
          {imagePaths.length > 1 && (
            <>
              <Box
                position="absolute"
                top="50%"
                left="16px"
                transform="translateY(-50%)"
                zIndex={2}
                cursor="pointer"
                onClick={() => sliderRef.current?.slickPrev()}
              >
                <BsChevronLeft
                  size={32}
                  color="white"
                  style={{
                    filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
                  }}
                />
              </Box>
              <Box
                position="absolute"
                top="50%"
                right="16px"
                transform="translateY(-50%)"
                zIndex={2}
                cursor="pointer"
                onClick={() => sliderRef.current?.slickNext()}
              >
                <BsChevronRight
                  size={32}
                  color="white"
                  style={{
                    filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      )}

      {/* 라이트박스 모달 */}
      <Modal isOpen={isImgOpen} onClose={onImgClose} size="full">
        <ModalOverlay />
        <ModalContent bg="black" userSelect="none">
          <ModalBody p={0} w="100vw" h="100vh" display="grid" placeItems="center" pos="relative">
            <Box
              pos="absolute"
              top="20px"
              right="24px"
              zIndex={1000}
              cursor="pointer"
              onClick={onImgClose}
              color="white"
              fontSize="28px"
            >
              ×
            </Box>

            {/* 좌/우 화살표 (라이트박스) */}
            {imagePaths.length > 1 && (
              <>
                <Box
                  pos="absolute"
                  top="50%"
                  left="24px"
                  transform="translateY(-50%)"
                  zIndex={1000}
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIdx((p) => (p > 0 ? p - 1 : imagePaths.length - 1));
                  }}
                >
                  <BsChevronLeft
                    size={36}
                    color="white"
                    style={{
                      filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
                    }}
                  />
                </Box>
                <Box
                  pos="absolute"
                  top="50%"
                  right="24px"
                  transform="translateY(-50%)"
                  zIndex={1000}
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIdx((p) => (p < imagePaths.length - 1 ? p + 1 : 0));
                  }}
                >
                  <BsChevronRight
                    size={36}
                    color="white"
                    style={{
                      filter: "drop-shadow(0 0 6px #888) drop-shadow(0 0 12px #888) drop-shadow(0 0 20px #888)",
                    }}
                  />
                </Box>
              </>
            )}

            <Image
              src={toImageUrl(imagePaths[previewIdx ?? currentSlide])}
              alt={`preview-${previewIdx ?? currentSlide}`}
              maxW="95vw"
              maxH="95vh"
              objectFit="contain"
              draggable={false}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 하단 액션 */}
      <Flex justify="flex-end" gap={2} mt={6}>
        <Button
          color="white"
          bg="black"
          size="sm"
          fontSize="sm"
          _hover={{ bg: "black", color: "white" }}
          onClick={() => navigate("/report")}
        >
          목록
        </Button>
        {user?.roleName === "ADMIN" && (
          <>
            <Button color="white" bg="red.500" size="sm" fontSize="sm" _hover={{ bg: "red.600" }} onClick={onOpen}>
              삭제
            </Button>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  게시물 삭제
                </AlertDialogHeader>
                <AlertDialogBody>해당 게시물을 정말 삭제하시겠습니까?</AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    취소
                  </Button>
                  <Button colorScheme="red" onClick={handleDelete} ml={3}>
                    삭제
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default ReportDetail;
