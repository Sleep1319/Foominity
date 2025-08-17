import { HStack, Box, Text, Badge } from "@chakra-ui/react";

export default function RoomListItem({ room, active, unread, onClick }) {
    const border = active ? "2px solid #319795" : "1px solid #e2e8f0";
    return (
        <HStack
            p={2}
            rounded="md"
            border={border}
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            onClick={onClick}
            position="relative"
        >
            {/* 빨간 점 */}
            {unread && (
                <Box position="absolute" right="10px" top="8px" w="8px" h="8px" bg="red.400" borderRadius="full" />
            )}

            <Box flex="1" minW={0}>
                <Text fontSize="sm" noOfLines={1}>
                    #{room.roomId} • {room.memberNickname ?? "닉네임없음"} ({`member:${room.memberId}`})
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    {room.lastMessage || "(메시지 없음)"}
                </Text>
            </Box>
            <Badge colorScheme={active ? "teal" : "gray"}>OPEN</Badge>
        </HStack>
    );
}