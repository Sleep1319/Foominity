import {
  Avatar, Box, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  Flex, HStack, useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiUser, FiHome, FiMusic, FiLogOut } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@/redux/useUser.js";
import { setChatRoomId, toggleChat, resetUnread } from "@/redux/chatSlice.js";
import handleCreateOrFindRoom from "@/components/chatComponents/handleCreateOrFindRoom"; // 인자 없이 호출하는 버전
import NotificationDot from "@/components/common/NotificationDot.jsx";

const UserSection = () => {
  const dispatch = useDispatch();
  const { logout, state } = useUser();

  const totalUnread = useSelector((s) =>
      Object.values(s.chat?.unreadCount || {}).reduce((a, b) => a + (b || 0), 0)
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickInquiry = async () => {
    // ✅ 네가 올린 handleCreateOrFindRoom는 인자 없이 POST /api/chat-room 호출하는 버전이므로 그대로 사용
    const roomId = await handleCreateOrFindRoom();
    if (roomId) {
      dispatch(setChatRoomId(roomId));
      dispatch(toggleChat());
      dispatch(resetUnread(String(roomId))); // 들어가면 읽음 처리
    }
  };

  const MenuItemWithIcon = ({ icon, label, to, onClick, rightAddon }) => (
      <MenuItem
          as={to ? RouterLink : undefined}
          to={to}
          onClick={onClick}
          height="28px"
          padding={0}
          pl={3}
          mb={1}
          bg="white"
          color="gray.700"
          fontSize="sm"
          _hover={{ bg: "white", color: "black", fontWeight: "semibold" }}
      >
        <Flex align="center" justify="space-between" w="100%">
          <HStack spacing={2}>
            <Box as={icon} fontSize="18px" />
            <Text>{label}</Text>
          </HStack>
          {rightAddon}
        </Flex>
      </MenuItem>
  );

  const LogoutMenu = ({ icon, label, onClick }) => (
      <MenuItem
          onClick={onClick}
          height="28px"
          padding={0}
          pl={3}
          mb={1}
          bg="white"
          color="gray.700"
          fontSize="sm"
          _hover={{ bg: "white", color: "red.400", fontWeight: "semibold" }}
      >
        <Flex align="center">
          <Box as={icon} fontSize="18px" mr={2} />
          <Text>{label}</Text>
        </Flex>
      </MenuItem>
  );

  const avatarSrc =
      state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg";

  return (
      <Box display="flex" alignItems="center" gap={3} top="20px" right="20px" zIndex="1000">
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <MenuButton>
            {/* 메뉴 닫혀 있고 읽지 않은 메시지가 있으면 아바타에 점 */}
            <Box position="relative" display="inline-block">
              <Avatar border="1px solid gray" size="md" src={avatarSrc} />
              <NotificationDot show={!isOpen && totalUnread > 0} top={-1} right={-1} size={9} />
            </Box>
          </MenuButton>

          <MenuList minW="190px">
            <Text fontWeight="bold" borderBottom="1px solid" borderColor="black" ml={3} mb={2}>
              {state.nickname}
            </Text>

            <MenuItemWithIcon icon={FiHome} label="Home" to="/" />
            <MenuItemWithIcon icon={FiUser} label="마이페이지" to="/mypage" />
            <MenuItemWithIcon icon={FiMusic} label="내 음악" to="/mymusic" />

            {/* 메뉴 열려 있을 땐 "문의" 항목 우측에 점 */}
            <MenuItemWithIcon
                icon={BsChatDots}
                label="문의"
                onClick={onClickInquiry}
                rightAddon={
                  <Box position="relative" w="16px" h="16px">
                    <NotificationDot show={isOpen && totalUnread > 0} size={8} top={2} right={2} />
                  </Box>
                }
            />

            {state?.roleName === "ADMIN" && (
                <MenuItemWithIcon icon={FaUserShield} label="관리자 페이지" to="/admin" />
            )}

            <MenuDivider />
            <LogoutMenu icon={FiLogOut} label="로그아웃" onClick={logout} />
          </MenuList>
        </Menu>
      </Box>
  );
};

export default UserSection;
