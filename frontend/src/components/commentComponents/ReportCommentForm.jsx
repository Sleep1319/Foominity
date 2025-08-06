// src/components/report/ReportCommentForm.jsx

import axios from "axios";
import { useUser} from "@/redux/useUser.js";
import CommentForm from "./CommentForm";

const ReportCommentForm = ({ reportId, onSuccess }) => {
  const { state } = useUser();
  const isLoggedIn = !!state;

  // content는 객체형태 { content: "내용" } 로 들어옴!
  const handleSubmit = async (payload) => {
    // payload: { content: "댓글내용" }
    if (!isLoggedIn) return;
    try {
      await axios.post(
        `/api/reports/${reportId}/comments`,
        { comment: payload.content }, // 서버에서 comment 또는 content 이름 맞게!
        {
          withCredentials: true,
        }
      );
      onSuccess?.(); // 댓글 등록 후 새로고침 등 필요시
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  return <CommentForm isLoggedIn={isLoggedIn} onSubmit={handleSubmit} />;
};

export default ReportCommentForm;
