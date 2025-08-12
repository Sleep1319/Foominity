import {
  Avatar, Box, Button, Flex, HStack, Input, Text, VStack,
  FormControl, FormErrorMessage, Icon,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@/redux/useUser.js";
import MyPostsTable from "../../components/memberComponents/MyPostsTable";
import { FiEdit } from "react-icons/fi";
import { FaMusic, FaUser, FaUserTag } from "react-icons/fa";
import LikedAlbums from "../../components/memberComponents/LikedAlbums";

const DEFAULT_AVATAR_PATH = "/src/assets/images/defaultProfile.jpg";

const EditProfile = ({ nickname: initialNickname, avatar, onNicknameChange }) => {
  const navigate = useNavigate();

  // 로컬 폼 상태
  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar || null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [favoriteGenre, setFavoriteGenre] = useState("");

  const fileInputRef = useRef();

  // ✅ useUser는 한 번만 호출
  const { state, updateUser } = useUser();
  const id = state.id;

  // 저장 직후 부모/Redux 업데이트가 들어오더라도
  // 인풋이 이전 값으로 되돌아가지 않도록 store 변경을 폼에 동기화
  useEffect(() => {
    if (state.nickname && state.nickname !== nickname) {
      setNickname(state.nickname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.nickname]);

  // 장르 통계 로드: id가 있을 때만
  useEffect(() => {
    if (!id) return;
    axios
        .get(`/api/member/${id}/genre-stats`, { withCredentials: true })
        .then((res) => {
          const stats = res.data.map(({ genre, count }) => ({ genre, count }));
          if (stats.length > 0) {
            const top = stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0]);
            setFavoriteGenre(top.genre);
          }
        })
        .catch((err) => console.error("장르 통계 불러오기 실패", err));
  }, [id]);

  // blob URL 정리(메모리 릭 방지)
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleNicknameChange = async (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setNicknameError("");

    if (!newNickname) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(newNickname)) {
      setNicknameError("닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.");
      return;
    }

    if (newNickname && newNickname !== initialNickname) {
      try {
        const res = await axios.get("/api/check-nickname", {
          params: { nickname: newNickname },
          withCredentials: true,
        });
        if (res.data.exists) {
          setNicknameError("이미 사용 중인 닉네임입니다.");
        }
      } catch (err) {
        console.error("닉네임 중복 체크 실패:", err);
      }
    }
  };

  const handlePhotoButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setNewAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setIsImageDeleted(false);
  };

  const handleDeletePhoto = () => {
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
    setNewAvatarFile(null);
    setIsImageDeleted(true);

    // ✅ Redux는 객체 패치만 (함수 패치 금지)
    updateUser({ avatar: null });
  };

  const handleSubmit = async () => {
    if (nicknameError) {
      alert("닉네임을 확인해주세요.");
      return;
    }

    let isChanged = false;
    try {
      // 1) 닉네임 변경
      if (nickname !== initialNickname) {
        await axios.post("/api/change-nickname", { nickname }, { withCredentials: true });
        onNicknameChange?.(nickname);
        isChanged = true;
      }

      // 2) 아바타 변경/삭제
      let updatedAvatarUrl = avatar;
      if (isImageDeleted) {
        await axios.delete("/api/member/profile-image", { withCredentials: true });
        updatedAvatarUrl = null;
        isChanged = true;
      } else if (newAvatarFile) {
        if (avatar) {
          await axios.delete("/api/member/profile-image", { withCredentials: true });
          isChanged = true;
        }
        const formData = new FormData();
        formData.append("file", newAvatarFile);
        const response = await axios.post("/api/member/profile-image", formData, {
          withCredentials: true,
        });
        updatedAvatarUrl = response.data.imageUrl;
        isChanged = true;
      }

      // 3) 클라이언트 즉시 반영(옵티미스틱)
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

  return (
      <>
        <Box maxW="1300px" mx="auto" mt={12} p={6}>
          <Text
              lineHeight="2.5"
              textAlign="center"
              fontSize="3xl"
              fontWeight="medium"
              borderBottom="2px solid gray"
              pb={2}
              mt={4}
              ml={16}
          >
            내 프로필 편집
          </Text>

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
                  <Avatar
                      boxSize="12rem"
                      src={
                        avatarPreview !== null
                            ? avatarPreview.startsWith("blob:")
                                ? avatarPreview
                                : `http://localhost:8084${avatarPreview}`
                            : DEFAULT_AVATAR_PATH
                      }
                  />
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
                    <Input
                        ml={4}
                        size="sm"
                        value={nickname}
                        onChange={handleNicknameChange}
                        placeholder={state.nickname}
                    />
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

          <Box mt={12}>
            <Flex>
              <Box flex="1" p={8}>
                <LikedAlbums />
              </Box>
              <Box flex="1" p={8}>
                <MyPostsTable />
              </Box>
            </Flex>
          </Box>
        </Box>
      </>
  );
};

export default EditProfile;
