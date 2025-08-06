import CommentForm from "./CommentForm.jsx";
import axios from "axios";
import { useUser} from "@/redux/useUser.js";

const BoardCommentForm = ({ boardId, onSuccess }) => {
  const { state } = useUser()
  const isLoggedIn = !!state;
  const handleSubmit = async (content) => {
    console.log("전송할 댓글 내용:", content);
    if (!isLoggedIn) return;
    try {
      await axios.post(`/api/boards/${boardId}/comments`,
          {comment: content},
          {
            withCredentials: true
          }
      );
      onSuccess?.(); // 성공 시 상위 컴포넌트 알림 (선택)
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  return <CommentForm isLoggedIn={isLoggedIn} onSubmit={handleSubmit}  />;
};

export default BoardCommentForm;
