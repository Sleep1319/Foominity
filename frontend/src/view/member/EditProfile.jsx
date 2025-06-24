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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import DefaultTable from "../../components/reportComponents/DefaultTable.jsx";
const EditProfile = ({ nickname: initialNickname, avatar, onNicknameChange, onAvatarChange }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar || null);
  const fileInputRef = useRef();
  const { state } = useUser();
  const { updateUser } = useUser();

  const handleNicknameChange = async (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setNicknameError("");

    if (newNickname && newNickname !== initialNickname) {
      try {
        const res = await axios.get("/api/check-nickname", {
          params: { nickname: newNickname },
        });
        if (res.data.exists) {
          setNicknameError("이미 사용 중인 닉네임입니다.");
        }
      } catch (err) {
        console.error("닉네임 중복 체크 실패:", err);
      }
    }
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // base64로 미리보기
        onAvatarChange(reader.result); // 상위 상태에도 반영
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (nicknameError) {
      alert("닉네임을 확인해주세요.");
      return;
    }
    if (nickname === initialNickname && avatarPreview === avatar) {
      navigate("/mypage");
      return;
    }

    try {
      if (nickname !== initialNickname) {
        await axios.post("/api/change-nickname", { nickname }, { withCredentials: true });

        onNicknameChange(nickname); // MyPage 내부 상태 업데이트
      }
      updateUser({ nickname, avatar: avatarPreview }); // 전역 상태 업데이트

      alert("닉네임이 수정되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error("닉네임 업데이트 실패:", err);
      alert("닉네임을 입력해주세요");
    }
  };
  return (
    <>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        pb={2}
        mt={4}
        ml={5}
      >
        프로필 수정
      </Text>

      <Flex maxW="3xl" mx="auto" mt={70} align="center" justify="flex-start">
        {/* <Box p={5} borderWidth={1} borderRadius="lg" flex="1" mr={6}> */}
        <Flex mb={6} align="center" justify="space-between" height={190}>
          <HStack spacing={6} align="center" flex="1">
            <VStack>
              <Avatar boxSize="12rem" />
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
                onClick={handlePhotoButtonClick}
                bg="transparent"
                border="1px solid black"
                color="black"
                _hover={{
                  borderWidth: "2px",
                  borderColor: "black",
                  bg: "white",
                }}
              >
                사진 수정
              </Button>
            </VStack>

            <VStack align="start" spacing={4}>
              <FormControl isInvalid={!!nicknameError}>
                <HStack>
                  <Text fontWeight="bold" w="80px">
                    닉네임
                  </Text>
                  <Input size="sm" value={nickname} onChange={handleNicknameChange} placeholder={state.nickname} />
                </HStack>
                <FormErrorMessage>{nicknameError}</FormErrorMessage>
              </FormControl>
              <HStack>
                <Text fontWeight="bold" w="80px">
                  유저명
                </Text>
                <Text>{state.username}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" w="80px">
                  이메일
                </Text>
                <Text>{state.email}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" w="80px">
                  등급
                </Text>
                <Text>{state.roleName}</Text>
              </HStack>
            </VStack>
          </HStack>
        </Flex>
        <Button
          ml={66}
          mr={7}
          onClick={handleSubmit}
          bg="transparent"
          border="1px solid black"
          color="black"
          _hover={{
            borderWidth: "2px",
            borderColor: "black",
            bg: "white",
          }}
        >
          저장
        </Button>
      </Flex>

      <Box maxW="3xl" mx="auto" px={4} mt={8}>
        <Text fontSize={20} mb={4}>
          내가 쓴 게시물
        </Text>
        <DefaultTable />
      </Box>
    </>
  );
};

export default EditProfile;
