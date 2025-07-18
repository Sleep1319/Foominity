import { Avatar, Box, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { FiUser, FiHome, FiLock, FiMusic, FiLogOut, FiPower, FiUnlock } from "react-icons/fi";

const UserSection = () => {
  const { logout } = useUser();
  const { state } = useUser();

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
  const LogoutMenu = ({ icon, label, to, onClick }) => (
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
    <Box display="flex" alignItems="center" gap={3} position="fixed" top="20px" right="20px" zIndex="1000">
      <Menu>
        <MenuButton>
          <Avatar
            size="md"
            src={state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg"}
          />
        </MenuButton>
        <MenuList minW="170px">
          <Text fontWeight="bold" borderBottom="1px solid" borderColor="black" borderRadius="0" ml={3} mb={2}>
            {state.nickname}
          </Text>

          <MenuItemWithIcon icon={FiHome} label="Home" to="/" />
          <MenuItemWithIcon icon={FiUser} label="마이페이지" to="/mypage" />
          <MenuItemWithIcon icon={FiMusic} label="내 음악" to="/mymusic" />

          <MenuDivider />

          <LogoutMenu icon={FiLogOut} label="로그아웃" onClick={logout} color="black" />
        </MenuList>
      </Menu>
    </Box>
  );
};

export default UserSection;
