import { Button,Avatar } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const AuthButtons = () => (
    <>
        <Button as={RouterLink} to="/login" variant="ghost">로그인</Button>
        <Button as={RouterLink} to="/register" colorScheme="teal">회원가입</Button>
        <Avatar as={RouterLink} to="/mypage" size="sm" />

    </>
);

export default AuthButtons;