import axios from "axios";

const handleCreateOrFindRoom = async () => {
    try {
        const { data } = await axios.post(
            "http://localhost:8084/api/chat-room",
            null,
            { withCredentials: true }
        );
        return data.roomId;
    } catch (err) {
        if (err?.response?.status === 401) {
            console.error("401 Unauthorized: 로그인 필요");
            alert("로그인이 필요합니다.");
        } else {
            console.error("채팅방 요청 실패:", err);
            alert("채팅방 요청에 실패했습니다.");
        }
        return null;
    }
};

export default handleCreateOrFindRoom;
