import { Box, Text } from "@chakra-ui/react";

const SliderBox = () => (
        <Box mb={8}>
            {/*
        <Image
          src="https://source.unsplash.com/random/1200x400?music"
          alt="Main Slider"
          borderRadius="md"
        />
        */}
            {/* 임시 백그라운드 색상 박스 */}
            <Box display="flex" gap={4} borderRadius="md" overflow="hidden" h="400px">
                <Box flex="1" bg="red.400" />
                <Box flex="1" bg="green.400" />
                <Box flex="1" bg="blue.400" />
                <Box flex="1" bg="yellow.400" />
                <Box flex="1" bg="purple.400" />
            </Box>
            <Text mt={2} fontWeight="bold" fontSize="xl">
                test1
            </Text>
        </Box>
)

export default SliderBox;