import { Avatar, Box, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const UserSection = () => {
  const { logout } = useUser();
  const { state } = useUser();

  return (
    <Box display="flex" alignItems="center" gap={3} position="fixed" top="20px" right="20px" zIndex="1000">
      {/* <Text>
        {state.nickname} ({state.roleName})
      </Text> */}

      <Menu>
        <MenuButton>
          <Avatar
            size="md"
            src={state.avatar ? `http://localhost:8084${state.avatar}` : "/src/assets/images/defaultProfile.jpg"}
          />
        </MenuButton>
        <MenuList>
          <Text fontWeight="bold" borderBottom="1px solid" borderColor="black" borderRadius="0" ml={1} mb={1}>
            {state.nickname}
          </Text>
          <MenuItem as={RouterLink} to="/" height="25px" fontSize={17} padding={0} pl={3} mt={2}>
            {/* Home 🏚 */}# Home
          </MenuItem>
          <MenuDivider />
          <MenuItem as={RouterLink} to="/mypage" height="25px">
            마이페이지
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={logout} height="25px" color="red">
            로그아웃
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default UserSection;
