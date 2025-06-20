import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// props로 받은 nickname과 혼용되지 않도록 initialNickname로 변경하여 사용하는 것
const EditProfile = ({ nickname: initialNickname }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef();

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  const handlePhotoButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // 수정 완료 버튼 클릭 시 닉네임과 사진 데이터 서버에 보내는 로직 (예시)
  const handleSubmit = () => {
    let message = `수정 완료!\n닉네임: ${nickname}`;
    if (avatarPreview) {
      message += "\n프로필 사진이 변경되었습니다.";
    }
    alert(message);

    // 완료 후 프로필 페이지 이동
    navigate("/mypage");
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="lg" flex="1" mr={6}>
      <Flex mb={6} align="center" justify="space-between">
        <HStack spacing={6} align="center" flex="1">
          <VStack spacing={2} align="center">
            <Avatar size="2xl" src={avatarPreview || undefined} />
            <Button size="sm" onClick={handlePhotoButtonClick}>
              사진 수정
            </Button>
            {/* 숨겨진 파일 input */}
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              display="none"
              onChange={handleFileChange}
            />
          </VStack>

          <VStack align="start" spacing={4} flex="1">
            <HStack w="100%">
              <Text fontWeight="bold" w="120px">
                닉네임 변경
              </Text>
              <Input
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="닉네임을 입력하세요"
              />
            </HStack>
          </VStack>
        </HStack>

        <Button ml={6} mr={7} onClick={handleSubmit}>
          수정 완료
        </Button>
      </Flex>
    </Box>
  );
};

export default EditProfile;
