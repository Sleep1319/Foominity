import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Flex,
  Button,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaUser, FaEnvelope, FaUserTag, FaIdBadge, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/redux/useUser.js";
import DeleteModal from "../../view/member/DeleteModal.jsx";
import MyPostsTable from "../../components/memberComponents/MyPostsTable.jsx";
import SettingsButton from "../../components/memberComponents/SettingsButton.jsx";
import MyRequests from "../../components/memberComponents/MyRequests.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const { state } = useUser();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handlePreview = () => {
    navigate(`/users/${state.id}/profile`);
  };

  // 라이트/다크 모드에 맞춘 배경/보더
  const cardBg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const tabInactive = useColorModeValue("gray.600", "gray.400");

  return (
    <>
      <Box maxW="1300px" mx="auto" mt={12} p={6}>
        <Text
          lineHeight="2.5"
          textAlign="center"
          fontSize="3xl"
          fontWeight="bold"
          borderBottom="2px solid"
          borderColor={borderCol}
          pb={2}
          mt={4}
          ml={5}
          
        >
          회원 정보
        </Text>

        <Flex
          maxW="3xl"
          mx="auto"
          mt={70}
          align="center"
          justify="space-between"
          gap={8}
        >
          <HStack spacing={6} align="center" flex="1">
            {/* Avatar + 미리보기 버튼 */}
            <Box position="relative" w="12rem" h="12rem">
              {/* 고정된 미리보기 버튼 */}
              <Button
                size="sm"
                leftIcon={<FaEye />}
                bg={cardBg}
                color="inherit"
                position="absolute"
                top="-35px"
                left="50%"
                transform="translateX(-50%)"
                zIndex="2"
                onClick={handlePreview}
                border="1px solid"
                borderColor={borderCol}
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              >
                내 프로필 미리보기
              </Button>

              <Avatar
                border="1px solid gray"
                borderColor={borderCol}
                boxSize="12rem"
                src={state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg"}
              />
            </Box>

            {/* 유저 정보 */}
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={FaUser} />
                <Text fontWeight="bold" w="80px">
                  닉네임
                </Text>
                <Text h="32px" lineHeight="32px">
                  {state.nickname}
                </Text>
              </HStack>
              <HStack>
                <Icon as={FaIdBadge} />
                <Text fontWeight="bold" w="80px">
                  이름
                </Text>
                <Text>{state.username}</Text>
              </HStack>
              <HStack>
                <Icon as={FaEnvelope} />
                <Text fontWeight="bold" w="80px">
                  이메일
                </Text>
                <Text>{state.email}</Text>
              </HStack>
              <HStack>
                <Icon as={FaUserTag} />
                <Text fontWeight="bold" w="80px">
                  등급
                </Text>
                <Text>{state.roleName}</Text>
              </HStack>
            </VStack>
          </HStack>

          <VStack>
            <SettingsButton/>
          </VStack>
        </Flex>
      </Box>

      {/* 탭 영역 */}
      <Box maxW="3xl" mx="auto" px={4} mt={8} mb={20}>
        <Tabs variant="enclosed" colorScheme="gray" isFitted>
          <TabList
            border="1px solid"
            borderColor={borderCol}
            rounded="xl"
            overflow="hidden"
            bg={cardBg}
          >
            <Tab
              _selected={{ bg: "black",color:"white", fontWeight: "bold" }}
              // _selected={{ bg: useColorModeValue("gray.100", "gray.700"), fontWeight: "bold" }}
              color={tabInactive}
              py={3}
            >
              내가 쓴 게시글
            </Tab>
            <Tab
              _selected={{ bg: "black",color:"white", fontWeight: "bold" }}
              // _selected={{ bg: useColorModeValue("gray.100", "gray.700"), fontWeight: "bold" }}
              color={tabInactive}
              py={3}
            >
              내 문의내역
            </Tab>
          </TabList>

          <TabPanels mt={4}
          minH="456px"
          >
            <TabPanel p={0}>
              {/* 구분선 */}
              <Divider mb={4} />
              <Box
                border="1px solid"
                borderColor={borderCol}
                rounded="xl"
                bg={cardBg}
                p={{ base: 3, md: 4 }}
              >
                {/* 기존 컴포넌트 그대로 삽입 */}
                <MyPostsTable />
              </Box>
            </TabPanel>

            <TabPanel p={0}>
              <Divider mb={4} />
              <Box
                border="1px solid"
                borderColor={borderCol}
                rounded="xl"
                bg={cardBg}
                p={{ base: 3, md: 4 }}
              >
                {/* 기존 컴포넌트 그대로 삽입 */}
                <MyRequests />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <DeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
};

export default Profile;

