import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  Icon,
  Grid,
  Heading,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@/redux/useUser.js";
import MyPostsTable from "../../components/memberComponents/MyPostsTable";
import { FiEdit } from "react-icons/fi";
import { FaMusic, FaUser, FaUserTag } from "react-icons/fa";
import LikedAlbums from "../../components/memberComponents/LikedAlbums";
import defaultProfile from "@/assets/images/defaultProfile.jpg";

const API_HOST = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/$/, "");
axios.defaults.withCredentials = true;

function toAbs(urlOrPath) {
  if (!urlOrPath) return "";
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  if (urlOrPath.startsWith("/")) return `${API_HOST}${urlOrPath}`;
  return `${API_HOST}/${urlOrPath}`;
}

const PREVIEW_COUNT = 4;

const SectionCard = ({ title, right, children }) => {
  const border = useColorModeValue("blackAlpha.200", "whiteAlpha.300");
  const bg = useColorModeValue("white", "black");

  return (
      <Box bg={bg} border="1px solid" borderColor={border} rounded="2xl" p={{ base: 4, md: 6 }}>
        <HStack justify="space-between" align="center" mb={3}>
          <Heading as="h3" size="md" fontWeight="semibold" letterSpacing="-0.01em">
            {title}
          </Heading>
          {right ? <Box>{right}</Box> : null}
        </HStack>
        <Divider borderColor={border} />
        <Box mt={{ base: 4, md: 5 }}>{children}</Box>
      </Box>
  );
};

const EditProfile = ({ nickname: initialNickname, avatar, onNicknameChange }) => {
  const navigate = useNavigate();
  const { state, updateUser } = useUser();
  const id = state.id;

  // 모달 & 데이터 (좋아요한 앨범)
  const likedDisc = useDisclosure();
  const [likedAll, setLikedAll] = useState([]);

  // 로컬 폼 상태
  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar || null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const fileInputRef = useRef();

  // 닉네임 동기화
  useEffect(() => {
    if (state.nickname && state.nickname !== nickname) setNickname(state.nickname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.nickname]);

  // 장르 통계 로드
  useEffect(() => {
    if (!id) return;
    axios
        .get(`/api/member/${id}/genre-stats`)
        .then((res) => {
          const stats = (res.data || []).map(({ genre, count }) => ({ genre, count }));
          if (stats.length > 0) {
            const top = stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0]);
            setFavoriteGenre(top.genre);
          }
        })
        .catch((err) => console.error("장르 통계 불러오기 실패", err));
  }, [id]);

  // 좋아요한 앨범 전체 리스트(모달용)
  useEffect(() => {
    axios
        .get("/api/member/liked-albums")
        .then((res) => {
          const mapped = (res.data || []).map((album) => {
            const artistsArr = (album.artists ?? []).map((a) => ({
              id: a.id ?? a.artistId ?? a.artist_id ?? null,
              name: a.name ?? a.artistName ?? "",
            }));
            return {
              id: album.id,
              imagePath: album.imagePath || album.coverImage || "",
              title: album.title,
              artists: artistsArr,
            };
          });
          setLikedAll(mapped);
        })
        .catch((err) => console.error("좋아요 앨범 불러오기 실패:", err));
  }, []);

  // blob URL 정리
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleNicknameChange = async (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setNicknameError("");

    if (!newNickname) return setNicknameError("닉네임을 입력해주세요.");
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(newNickname)) return setNicknameError("닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.");

    if (newNickname && newNickname !== initialNickname) {
      try {
        const res = await axios.get("/api/check-nickname", {
          params: { nickname: newNickname },
        });
        if (res.data?.exists) setNicknameError("이미 사용 중인 닉네임입니다.");
      } catch (err) {
        console.error("닉네임 중복 체크 실패:", err);
      }
    }
  };

  const handlePhotoButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setNewAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // 미리보기는 blob
    setIsImageDeleted(false);
  };

  const handleDeletePhoto = () => {
    if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setNewAvatarFile(null);
    setIsImageDeleted(true);
    updateUser({ avatar: null });
  };

  const handleSubmit = async () => {
    if (nicknameError) return alert("닉네임을 확인해주세요.");

    let isChanged = false;
    try {
      if (nickname !== initialNickname) {
        await axios.post("/api/change-nickname", { nickname });
        onNicknameChange?.(nickname);
        isChanged = true;
      }

      let updatedAvatarUrl = avatar;
      if (isImageDeleted) {
        await axios.delete("/api/member/profile-image");
        updatedAvatarUrl = null;
        isChanged = true;
      } else if (newAvatarFile) {
        if (avatar) {
          await axios.delete("/api/member/profile-image");
          isChanged = true;
        }
        const formData = new FormData();
        formData.append("file", newAvatarFile);
        const response = await axios.post("/api/member/profile-image", formData);
        updatedAvatarUrl = response.data?.imageUrl || null; // 서버가 "uploads/..." 형태 반환한다고 가정
        isChanged = true;
      }

      if (isChanged) {
        updateUser({ nickname, avatar: updatedAvatarUrl });
        alert("프로필이 수정되었습니다!");
      }
      navigate("/mypage");
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  const goArtist = (e, a) => {
    e.stopPropagation();
    if (a?.id) navigate(`/artist/${a.id}`);
  };

  // 아바타 src 결정
  const avatarSrc =
      avatarPreview !== null
          ? avatarPreview.startsWith("blob:")
              ? avatarPreview
              : toAbs(avatarPreview) // 서버 저장 경로일 때
          : defaultProfile;

  return (
      <>
        <Box maxW="1300px" mx="auto" mt={12} p={6}>
          <Text
              lineHeight="2.5"
              textAlign="center"
              fontSize="3xl"
              fontWeight="bold"
              borderBottom="2px solid gray"
              pb={2}
              mt={4}
              ml={16}
          >
            내 프로필 편집
          </Text>

          {/* 상단 프로필 편집 영역 */}
          <Flex maxW="3xl" mx="auto" mt={12} mb={8} align="center" justify="center">
            <Flex mb={55} align="center" justify="space-between" height={190}>
              <VStack spacing={0} position="relative">
                <Box
                    position="relative"
                    w="12rem"
                    h="12rem"
                    borderRadius="full"
                    overflow="hidden"
                    role="group"
                    cursor="pointer"
                    border="1px solid gray"
                    onClick={handlePhotoButtonClick}
                >
                  <Avatar boxSize="12rem" src={avatarSrc} />
                  <Flex
                      position="absolute"
                      top="0"
                      left="0"
                      w="100%"
                      h="100%"
                      bg="blackAlpha.500"
                      color="white"
                      opacity="0"
                      align="center"
                      justify="center"
                      fontSize="sm"
                      fontWeight="semibold"
                      _groupHover={{ opacity: 1 }}
                      transition="opacity 0.3s"
                      zIndex="1"
                      pointerEvents="none"
                  >
                    사진 변경
                  </Flex>
                </Box>

                <Box
                    position="absolute"
                    bottom="1"
                    right="1"
                    bg="white"
                    p="1"
                    borderRadius="full"
                    zIndex="2"
                    w="42px"
                    h="42px"
                    mb="47px"
                    mr="5px"
                    display="flex"
                    border="1px solid gray"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    onClick={handlePhotoButtonClick}
                >
                  <FiEdit size="25px" />
                </Box>

                <Input
                    size="sm"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    display="none"
                    onChange={handleFileChange}
                />

                <Button
                    size="sm"
                    mt={2}
                    onClick={handleDeletePhoto}
                    bg="transparent"
                    border="1px solid red"
                    color="red"
                    _hover={{ borderWidth: "2px", borderColor: "red", bg: "white" }}
                >
                  사진 삭제
                </Button>
              </VStack>

              <VStack align="start" spacing={5} ml={10}>
                <FormControl isInvalid={!!nicknameError}>
                  <HStack>
                    <Icon as={FaUser} />
                    <Text fontWeight="bold" w="80px">
                      닉네임
                    </Text>
                    <Input ml={4} size="sm" value={nickname} onChange={handleNicknameChange} placeholder={state.nickname} />
                  </HStack>
                  <FormErrorMessage>{nicknameError}</FormErrorMessage>
                </FormControl>
                <HStack>
                  <Icon as={FaUserTag} />
                  <Text fontWeight="bold" w="80px">
                    등급
                  </Text>
                  <Text>{state.roleName}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaMusic} />
                  <Text fontWeight="bold" w="120px">
                    선호하는 장르
                  </Text>
                  <Text>{favoriteGenre || "-"}</Text>
                </HStack>
              </VStack>
            </Flex>

            <Button
                ml={66}
                mr={75}
                w="85px"
                onClick={handleSubmit}
                bg="white"
                border="2px solid black"
                color="black"
                _hover={{ borderColor: "green.400", bg: "green.400", color: "white" }}
            >
              저장
            </Button>
          </Flex>

          <Box mt={12} minH="470px">
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }} alignItems="start">
              {/* 좋아요한 앨범 섹션: 버튼 + 모달 */}
              <SectionCard
                  title="좋아요한 앨범"
                  right={
                    likedAll.length > PREVIEW_COUNT ? (
                        <Button
                            size="xs"
                            variant="outline"
                            borderColor="blackAlpha.300"
                            color="black"
                            onClick={likedDisc.onOpen}
                            _hover={{ bg: "black", color: "white", borderColor: "black" }}
                            rounded="md"
                        >
                          전체보기
                        </Button>
                    ) : null
                  }
              >
                <Box
                    sx={{
                      "& > *": {
                        width: "fit-content",
                        marginInline: "auto",
                      },
                    }}
                >
                  <LikedAlbums />
                </Box>
              </SectionCard>

              <SectionCard title="작성한 글">
                <MyPostsTable />
              </SectionCard>
            </Grid>
          </Box>
        </Box>

        {/* ===== 좋아요한 앨범 모달 ===== */}
        <Modal isOpen={likedDisc.isOpen} onClose={likedDisc.onClose} size="5xl" isCentered scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>좋아요한 앨범 전체보기</ModalHeader>
            <ModalCloseButton />
            <ModalBody maxH="80vh" overflowY="auto" sx={{ overscrollBehaviorY: "contain" }}>
              <SimpleGrid columns={[2, 3, 4]} spacing={8} py={4}>
                {likedAll.map((album) => (
                    <VStack
                        key={album.id}
                        spacing={2}
                        align="start"
                        cursor="pointer"
                        onClick={() => {
                          likedDisc.onClose();
                          navigate(`/review/${album.id}`);
                        }}
                    >
                      <Image
                          src={album.imagePath ? toAbs(album.imagePath) : ""}
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
                        {Array.isArray(album.artists) && album.artists.length > 0
                            ? album.artists.map((a, i) => (
                                <React.Fragment key={a.id ?? `${a.name}-${i}`}>
                                  <Text
                                      as="span"
                                      cursor="pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        goArtist(e, a);
                                      }}
                                      _hover={{ color: "black", fontWeight: "medium" }}
                                  >
                                    {a.name}
                                  </Text>
                                  {i < album.artists.length - 1 && ", "}
                                </React.Fragment>
                            ))
                            : ""}
                      </Text>
                    </VStack>
                ))}
              </SimpleGrid>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
  );
};

export default EditProfile;
