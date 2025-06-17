import { Box, HStack, Heading, Button, IconButton, Spacer } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useColorMode } from '@chakra-ui/react'
import React from 'react'

const AppNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const iconElement = colorMode === 'light' ? <MoonIcon /> : <SunIcon />;
  return (
    <Box as="header" px={6} py={4} borderBottom="1px solid #eee">
      <HStack>
        <Heading size="md">Sitemark</Heading>
        <Spacer />
        <Button variant="ghost">로그인</Button>
        <Button colorScheme="teal">회원가입</Button>
        <IconButton
            icon={iconElement}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
        />
      </HStack>
    </Box>
  )
}

export default AppNavbar