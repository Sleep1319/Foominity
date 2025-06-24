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

const EditProfile = ({ nickname: initialNickname, avatar, onNicknameChange, onAvatarChange }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar || null);
  const fileInputRef = useRef();

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

    try {
      await axios.post("/api/change-nickname", { nickname }, { withCredentials: true });

      onNicknameChange(nickname); // MyPage 내부 상태 업데이트
      updateUser({ nickname, avatar: avatarPreview }); // 전역 상태 업데이트

      alert("닉네임이 수정되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error("닉네임 업데이트 실패:", err);
      alert("닉네임 변경 실패");
    }
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
            <Input type="file" accept="image/*" ref={fileInputRef} display="none" onChange={handleFileChange} />
          </VStack>

          <VStack align="start" spacing={4} flex="1">
            <FormControl isInvalid={!!nicknameError}>
              <HStack w="100%">
                <Text fontWeight="bold" w="120px">
                  닉네임 변경
                </Text>
                <Input value={nickname} onChange={handleNicknameChange} placeholder="닉네임을 입력하세요" />
              </HStack>
              <FormErrorMessage>{nicknameError}</FormErrorMessage>
            </FormControl>
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
// ===========================================
// import { Avatar, Box, Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react";
// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// // props로 받은 nickname과 혼용되지 않도록 initialNickname로 변경하여 사용하는 것
// const EditProfile = ({ nickname: initialNickname, onNicknameChange }) => {
//   const navigate = useNavigate();
//   const [nickname, setNickname] = useState(initialNickname);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const fileInputRef = useRef();

//   const handleNicknameChange = (e) => {
//     setNickname(e.target.value);
//   };
//   const handlePhotoButtonClick = () => {
//     fileInputRef.current.click();
//   };
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result); // base64 이미지 미리보기
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // 수정 완료 버튼 클릭 시 닉네임과 사진 데이터 서버에 보내는 로직 (예시)
//   // const handleSubmit = () => {
//   //   let message = `수정 완료!\n닉네임: ${nickname}`;
//   //   if (avatarPreview) {
//   //     message += "\n프로필 사진이 변경되었습니다.";
//   //   }
//   //   alert(message);

//   //   // 완료 후 프로필 페이지 이동
//   //   navigate("/mypage");
//   // };
//   // 이미지 변경사항은 아직 반영 안 됨
//   const handleSubmit = async () => {
//     try {
//       await axios.post("/api/change-nickname", { nickname }, { withCredentials: true });

//       onNicknameChange(nickname);
//       alert("닉네임이 수정되었습니다!");
//       navigate("/mypage");
//     } catch (err) {
//       console.error("닉네임 업데이트 실패:", err);

//       if (err.response && err.response.data) {
//         // 서버가 보낸 에러 메시지 출력
//         alert(err.response.data);
//       } else {
//         alert("닉네임 변경에 실패하였습니다.");
//       }
//     }
//   };

//   return (
//     <Box p={5} borderWidth={1} borderRadius="lg" flex="1" mr={6}>
//       <Flex mb={6} align="center" justify="space-between">
//         <HStack spacing={6} align="center" flex="1">
//           <VStack spacing={2} align="center">
//             <Avatar size="2xl" src={avatarPreview || undefined} />
//             <Button size="sm" onClick={handlePhotoButtonClick}>
//               사진 수정
//             </Button>
//             {/* 숨겨진 파일 input */}
//             <Input type="file" accept="image/*" ref={fileInputRef} display="none" onChange={handleFileChange} />
//           </VStack>

//           <VStack align="start" spacing={4} flex="1">
//             <HStack w="100%">
//               <Text fontWeight="bold" w="120px">
//                 닉네임 변경
//               </Text>
//               <Input value={nickname} onChange={handleNicknameChange} placeholder="닉네임을 입력하세요" />
//             </HStack>
//           </VStack>
//         </HStack>

//         <Button ml={6} mr={7} onClick={handleSubmit}>
//           수정 완료
//         </Button>
//       </Flex>
//     </Box>
//   );
// };

// export default EditProfile;
