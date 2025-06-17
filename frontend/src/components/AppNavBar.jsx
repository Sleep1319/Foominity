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
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            zIndex="1000"
        >
            <HStack>
                <Heading size="md">HIPHOPLE</Heading>

                <Spacer />

                {/* 네비 메뉴 버튼 */}
                <Button variant="ghost">Review</Button>
                <Button variant="ghost">FreeBoard</Button>
                <Button variant="ghost">Notice</Button>
                <Button variant="ghost">Report</Button>
                <Button variant="ghost">Discussion</Button>
                <Button variant="ghost">Workspace</Button>
                <Button variant="ghost">Shop</Button>

                <Spacer />

                {/* 로그인, 회원가입 버튼 */}
                <Button variant="ghost">로그인</Button>
                <Button colorScheme="teal">회원가입</Button>

                {/* 다크모드 토글 */}
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
