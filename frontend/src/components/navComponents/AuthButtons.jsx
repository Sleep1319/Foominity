import { Button, Avatar, HStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const glassShadow = `
  0 0 0 1px rgba(255, 255, 255, 0.1),
  0 4px 30px rgba(0, 0, 0, 0.1),
  0 0 8px rgba(255, 255, 255, 0.05)
`;

const textShadow = `
  -1px -1px 0 black,
   1px -1px 0 black,
  -1px  1px 0 black,
   1px  1px 0 black,
   0 0 4px black,
   0 0 8px black
`;

const AuthButtons = () => (
  <HStack spacing={4}>
    <Button
      as={RouterLink}
      to="/login"
      variant="ghost"
      color="white"
      px={4}
      py={2}
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(8px)"
      borderRadius="lg"
      boxShadow={glassShadow}
      textShadow={textShadow}
      _hover={{
        bg: "rgba(255, 255, 255, 0.18)",
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.2),
          0 6px 40px rgba(0, 0, 0, 0.15),
          0 0 12px rgba(255, 255, 255, 0.1)
        `
      }}
    >
      login
    </Button>

    <Button
      as={RouterLink}
      to="/register"
      color="white"
      px={4}
      py={2}
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(8px)"
      borderRadius="lg"
      boxShadow={glassShadow}
      textShadow={textShadow}
      _hover={{
        bg: "rgba(255, 255, 255, 0.18)",
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.2),
          0 6px 40px rgba(0, 0, 0, 0.15),
          0 0 12px rgba(255, 255, 255, 0.1)
        `
      }}
    >
      sign up
    </Button>

    <Avatar as={RouterLink} to="/mypage" size="sm" />
  </HStack>
);

export default AuthButtons;
