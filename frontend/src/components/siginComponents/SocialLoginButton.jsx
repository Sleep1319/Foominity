import { Button, HStack, Image } from "@chakra-ui/react";

const SocialLoginButton = ({ mode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const redirect = (provider) => {
    const baseUrl = `${backendUrl}/oauth2/authorization/${provider}`;
    const finalUrl = mode === "register" ? `${baseUrl}?mode=signup` : baseUrl;
    window.location.href = finalUrl;
  };

  return (
    <HStack spacing={4} mt={4}>
      <Button
        bg="gray.100"
        onClick={() => redirect("google")}
        width="full"
        leftIcon={<Image src="/images/socialLoginButton/google_icon.png" boxSize="20px" />}
      >
        구글로 로그인
      </Button>
      <Button
        colorScheme="yellow"
        onClick={() => redirect("kakao")}
        width="full"
        leftIcon={<Image ml={0} src="/images/socialLoginButton/kakao_icon.png" boxSize="20px" />}
      >
        카카오로 로그인
      </Button>
    </HStack>
  );
};

export default SocialLoginButton;

// import { Button, HStack } from "@chakra-ui/react";

// const SocialLoginButton = ({ mode }) => {
//   const isLogin = mode === "login";
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const redirect = (provider) => {
//     const baseUrl = `${backendUrl}/oauth2/authorization/${provider}`;
//     const finalUrl = mode === "register" ? `${baseUrl}?mode=signup` : baseUrl;
//     window.location.href = finalUrl;
//   };

//   return (
//     <HStack spacing={4} mt={4}>
//       <Button colorScheme="red" onClick={() => redirect("google")} width="full">
//         Google로 {isLogin ? "로그인" : "회원가입"}
//       </Button>
//       <Button colorScheme="yellow" onClick={() => redirect("kakao")} width="full">
//         Kakao로 {isLogin ? "로그인" : "회원가입"}
//       </Button>
//     </HStack>
//   );
// };

// export default SocialLoginButton;
