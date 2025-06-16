import {
    Box, Heading, Text, HStack, VStack,
    InputGroup, Input, IconButton,
    SimpleGrid, Image, Button
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const Home = () => {
    return (
        <Box p={6} maxW="7xl" mx="auto">
            {/* 타이틀 */}
            <VStack align="start" mb={6}>
                <Heading>Blog</Heading>
                <Text>Stay in the loop with the latest about our products</Text>
            </VStack>

            {/* 카테고리 */}
            <HStack spacing={4} mb={6}>
                {['All categories', 'Company', 'Product', 'Design', 'Engineering'].map((c) => (
                    <Button key={c} variant="ghost">{c}</Button>
                ))}
            </HStack>

            {/* 검색창 + RSS */}
            <HStack mb={6} position="relative" maxW="300px">
                <InputGroup w="full">
                    <Input placeholder="Search..." pr="2.5rem" />
                    <IconButton
                        aria-label="Search"
                        icon={<SearchIcon />}
                        size="sm"
                        variant="ghost"
                        position="absolute"
                        right="0.5rem"
                        top="50%"
                        transform="translateY(-50%)"
                    />
                </InputGroup>
                <IconButton icon={<span>📡</span>} aria-label="RSS" />
            </HStack>

            {/* 블로그 카드 */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {[1, 2].map((n) => (
                    <Box key={n} borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Image src={`https://source.unsplash.com/random/800x400?sig=${n}`} />
                        <Box p={4}>
                            <Text fontSize="sm" color="gray.500">Engineering</Text>
                            <Heading size="md" mt={2}>Post Title #{n}</Heading>
                            <Text mt={1}>This is the description text for the post...</Text>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default Home;