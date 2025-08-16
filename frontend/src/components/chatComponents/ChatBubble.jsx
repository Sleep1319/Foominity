import { Box, Text } from "@chakra-ui/react";

export default function ChatBubble({
                                       children,
                                       mine = false,        // 내가 보낸 메시지?
                                       name = "",
                                       time = "",
                                       maxW = "80%",
                                   }) {
    return (
        <Box w="100%" display="flex" justifyContent={mine ? "flex-end" : "flex-start"} px={1}>
            <Box
                maxW={maxW}
                px={3}
                py={2}
                bg={mine ? "teal.100" : "gray.200"}   // ✅ 내가 보낸 건 민트, 상대는 회색
                color="black"
                borderRadius="lg"
                boxShadow="sm"
                // 말풍선 모양 살짝 다르게
                borderTopLeftRadius={mine ? "lg" : "sm"}
                borderTopRightRadius={mine ? "sm" : "lg"}
                borderBottomLeftRadius="lg"
                borderBottomRightRadius="lg"
            >
                {(name || time) && (
                    <Text fontSize="xs" color="gray.600" mb={1}>
                        {name}{time ? ` • ${time}` : ""}
                    </Text>
                )}
                <Text fontSize="sm" whiteSpace="pre-wrap" wordBreak="break-word">
                    {children}
                </Text>
            </Box>
        </Box>
    );
}