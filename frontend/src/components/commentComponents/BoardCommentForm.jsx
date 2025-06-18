import CommentForm from "./CommentForm.jsx";
import axios from "axios";

const BoardCommentForm = ({ boardId, onSuccess }) => {
  const handleSubmit = async (content) => {
    await axios.post(`/api/boards/${boardId}/comments`, { content });
    onSuccess?.(); // 성공 시 상위 컴포넌트 알림 (선택)
  };

  return <CommentForm onSubmit={handleSubmit} />;
};

export default BoardCommentForm;
