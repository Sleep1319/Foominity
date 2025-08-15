import { Avatar, Box, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiUser, FiHome, FiMusic, FiLogOut } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";
import { useUser } from "../../redux/useUser"; // Redux 기반 커스텀 훅
import { setChatRoomId, toggleChat } from "../../redux/chatSlice";
import handleCreateOrFindRoom from "../chatComponents/handleCreateOrFindRoom";
import { FaUserShield } from "react-icons/fa";

const UserSection = () => {
  const dispatch = useDispatch();
  const { logout, state } = useUser(); // Redux에서 유저 정보, 로그아웃 액션

  const onClickInquiry = async () => {
    const targetId = 1; // 예: 관리자 ID
    const roomId = await handleCreateOrFindRoom({ targetId });
    if (roomId) {
      dispatch(setChatRoomId(roomId));
      dispatch(toggleChat());
    }
  };

  const MenuItemWithIcon = ({ icon, label, to, onClick }) => (
    <MenuItem
      as={to ? RouterLink : undefined}
      to={to}
      onClick={onClick}
      height="25px"
      padding={0}
      pl={3}
      mb={2}
      bg="white"
      color="gray.600"
      fontSize="sm"
      _hover={{
        bg: "white",
        color: "black",
        fontWeight: "semibold",
      }}
    >
      <Flex align="center">
        <Box as={icon} fontSize="18px" mr={2} />
        <Text>{label}</Text>
      </Flex>
    </MenuItem>
  );

  const LogoutMenu = ({ icon, label, onClick }) => (
    <MenuItem
      onClick={onClick}
      height="25px"
      padding={0}
      pl={3}
      mb={2}
      bg="white"
      color="gray.600"
      fontSize="sm"
      _hover={{
        bg: "white",
        color: "red.400",
        fontWeight: "semibold",
      }}
    >
      <Flex align="center">
        <Box as={icon} fontSize="18px" mr={2} />
        <Text>{label}</Text>
      </Flex>
    </MenuItem>
  );

  return (
    <Box display="flex" alignItems="center" gap={3} top="20px" right="20px" zIndex="1000">
      <Menu>
        <MenuButton>
          <Avatar
            border="1px solid gray"
            size="md"
            src={state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg"}
          />
        </MenuButton>
        <MenuList minW="170px">
          <Text fontWeight="bold" borderBottom="1px solid" borderColor="black" ml={3} mb={2}>
            {state.nickname}
          </Text>

          <MenuItemWithIcon icon={FiHome} label="Home" to="/" />
          <MenuItemWithIcon icon={FiUser} label="마이페이지" to="/mypage" />
          <MenuItemWithIcon icon={FiMusic} label="내 음악" to="/mymusic" />
          <MenuItemWithIcon icon={BsChatDots} label="문의" onClick={onClickInquiry} />
          {state?.roleName === "ADMIN" && <MenuItemWithIcon icon={FaUserShield} label="관리자 페이지" to="/admin" />}

          <MenuDivider />

          <LogoutMenu icon={FiLogOut} label="로그아웃" onClick={logout} />
        </MenuList>
      </Menu>
    </Box>
  );
};

export default UserSection;
