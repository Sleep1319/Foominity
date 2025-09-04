
import { useState } from "react";
import {
    Box,
    SimpleGrid,
    Text,
    Heading,
    VStack,
    HStack,
    Button,
    Badge,
} from "@chakra-ui/react";
import AppleMusicChart from "./AppleMusicChart";

// 👉 public/images/country/kr.png 이런 구조로 배치했다고 가정
const COUNTRY_CARDS = [
    { key: "kr", title: "Korea", subtitle: "Top 50: 대한민국", img: "/images/country/kr.png" },
    { key: "us", title: "USA", subtitle: "Top 50: 미국", img: "/images/country/us.png" },
    { key: "jp", title: "Japan", subtitle: "Top 50: 일본", img: "/images/country/jp.png" },
    { key: "gb", title: "UK", subtitle: "Top 50: 영국", img: "/images/country/uk.png" },
];

const COUNTRY_LABEL = {
    kr: "대한민국",
    us: "미국",
    jp: "일본",
    gb: "영국",
};

export default function AppleMusicCountryGrid() {
    const [selected, setSelected] = useState(null);

    if (selected) {
        const countryLabel = COUNTRY_LABEL[selected] ?? selected.toUpperCase();
        return (
            <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                    <HStack>
                        <Heading size="md">Apple Music Most Played — {countryLabel}</Heading>
                        <Badge colorScheme="pink" variant="subtle">
                            Top 50
                        </Badge>
                    </HStack>
                    <Button
                        fontWeight="medium"
                        variant="ghost"
                        color="gray.600"
                        onClick={() => setSelected(null)}
                        _hover={{ bg: "white", color: "black" }}
                    >
                        ← 다른 차트 보기
                    </Button>
                </HStack>

                {/* ✅ AppleMusicChart에 country props 넘김 */}
                <AppleMusicChart country={selected} boxMaxH={420} initialVisible={12} step={8} />
            </VStack>
        );
    }

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="md">국가별 차트</Heading>
                <Text color="gray.500">from Apple Music</Text>
            </HStack>

            <SimpleGrid columns={[2, 2, 4]} spacing={5}>
                {COUNTRY_CARDS.map(({ key, title, subtitle, img }) => (
                    <Box
                        key={key}
                        role="button"
                        onClick={() => setSelected(key)}
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="md"
                        bg="white"
                        transition="transform .15s ease"
                        _hover={{ transform: "translateY(-2px)" }}
                    >
                        {/* 정사각형 이미지 */}
                        <Box
                            position="relative"
                            w="100%"
                            pt="100%" // 1:1 비율
                            bgImage={`url(${img})`}
                            bgSize="cover"
                            bgPos="center"
                            bgColor="gray.100"
                        />
                        <Box p={3}>
                            <Text fontWeight="bold" fontSize="lg">
                                {title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                                {subtitle}
                            </Text>
                            <Text mt={1} fontSize="xs" color="gray.400">
                                Apple Music
                            </Text>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
}
