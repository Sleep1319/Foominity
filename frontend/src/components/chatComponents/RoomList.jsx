import { VStack, HStack, Text, Button, Divider, Input, Box, Badge } from "@chakra-ui/react";
import RoomListItem from "./RoomListItem";
import React, { useMemo } from "react";

export default function RoomList({
                                     rooms = [],
                                     activeRoomId,
                                     unreadSet,                 // Set<number>
                                     onSelectRoom,              // (roomId:number)=>void
                                     onRefresh,                 // ()=>void
                                 }) {
    const [q, setQ] = React.useState("");

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return rooms;
        return rooms.filter((r) => {
            const nick = (r.memberNickname ?? "").toLowerCase();
            const idStr = String(r.memberId ?? "");
            const roomStr = String(r.roomId ?? "");
            return nick.includes(s) || idStr.includes(s) || roomStr.includes(s);
        });
    }, [q, rooms]);

    return (
        <VStack
            align="stretch"
            w={{ base: "300px", md: "320px", lg: "340px" }}
            border="1px solid #e2e8f0"
            p={3}
            rounded="md"
            spacing={2}
            h="75vh"
        >
            <HStack justify="space-between" position="sticky" top={0} bg="white" zIndex={1} pb={1}>
                <Text fontWeight="bold">문의 목록</Text>
                <Button size="xs" onClick={onRefresh}>새로고침</Button>
            </HStack>

            <Input
                size="sm"
                placeholder="닉네임/아이디/방번호 검색"
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />

            <Divider />

            <VStack
                align="stretch"
                spacing={1}
                flex="1"
                minH={0}
                overflowY="auto"
                pr={1}
                sx={{
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": { background: "#cbd5e0", borderRadius: "8px" },
                }}
            >
                {filtered.length === 0 && <Text color="gray.500">결과가 없습니다.</Text>}

                {filtered.map((r) => (
                    <RoomListItem
                        key={r.roomId}
                        room={r}
                        active={activeRoomId === r.roomId}
                        unread={unreadSet?.has(r.roomId)}
                        onClick={() => onSelectRoom(r.roomId)}
                    />
                ))}
            </VStack>
        </VStack>
    );
}