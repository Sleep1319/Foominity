import { Box, Button, Text } from "@chakra-ui/react";
import { useUser } from "@/context/UserContext";

const UserSection = () => {
    const { state, logout } = useUser();

    return (
        <Box display="flex" alignItems="center" gap={3}>
            <Text>
                {state.nickname} ({state.roleName})
            </Text>
            <Button colorScheme="red" variant="outline" onClick={logout}>
                로그아웃
            </Button>
        </Box>
    );
};

export default UserSection;