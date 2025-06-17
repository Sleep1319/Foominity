import { Box, HStack, Heading, Button, IconButton, Spacer } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useColorMode } from '@chakra-ui/react';
import React from 'react';

const AppNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconElement = colorMode === 'light' ? <MoonIcon /> : <SunIcon />;

  return (
      <Box
          as="header"
          px={6}
          py={4}
          borderBottom="1px solid #eee"
          position="sticky"
          top="0"
          bg="white"
          zIndex="1000"
      >
        <HStack>
          <Heading size="md">HIPHOPLE</Heading> {/* 기존 네비 타이틀 유지 or 변경 가능 */}

          <Spacer />

          {/* 메인 네비게이션 버튼들 */}
          <Button variant="ghost">Review</Button>
          <Button variant="ghost">FreeBoard</Button>
          <Button variant="ghost">Notice</Button>
          <Button variant="ghost">Report</Button>
          <Button variant="ghost">Discussion</Button>
          <Button variant="ghost">Workspace</Button>
          <Button variant="ghost">Shop</Button>

          <Spacer />

          {/* 기존 로그인/회원가입 버튼 */}
          <Button variant="ghost">로그인</Button>
          <Button colorScheme="teal">회원가입</Button>

          {/* 컬러모드 토글 */}
          <IconButton
              icon={iconElement}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
          />
        </HStack>
      </Box>
  );
};

export default AppNavbar;