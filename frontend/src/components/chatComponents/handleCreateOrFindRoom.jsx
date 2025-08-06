import axios from "axios";

const handleCreateOrFindRoom = async ({ targetId }) => {
    try {
        const response = await axios.post(`/api/chat-room`, { targetId });
        return response.data.roomId;
    } catch (err) {
        console.error("채팅방 요청 실패:", err);
        alert("채팅방 요청에 실패했습니다.");
        return null;
    }
};

export default handleCreateOrFindRoom;