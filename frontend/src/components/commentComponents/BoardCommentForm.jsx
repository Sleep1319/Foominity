import CommentForm from "./CommentForm.jsx";
import axios from "axios";
import { useUser } from "@/redux/useUser.js";

const BoardCommentForm = ({ boardId, onSuccess }) => {
  const { state } = useUser();
  const token = state?.accessToken || state?.token;
  const isLoggedIn = !!token;

  const handleSubmit = async (raw) => {
    const text = String((typeof raw === "string" ? raw : raw?.content) ?? "").trim();
    if (!text) return;
    console.log("전송할 댓글 내용(정규화):", text);

    if (!isLoggedIn || !text?.trim()) return;

    try {
      await axios.post(
        `/api/boards/${boardId}/comments`,
        { comment: text },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      onSuccess?.();
    } catch (error) {
      console.error("댓글 등록 실패:", error.response?.status, error.response?.data || error.message);
    }
  };

  return <CommentForm isLoggedIn={isLoggedIn} onSubmit={handleSubmit} />;
};

export default BoardCommentForm;
