// components/ReviewCommentForm.jsx
import React from "react";
import CommentForm from "./CommentForm.jsx";
import axios from "axios";
import { useUser} from "@/redux/useUser.js";

const ReviewCommentForm = ({ reviewId, commentCount = 0, onSuccess }) => {
  const { state } = useUser()
  const isLoggedIn = !!state;

  const handleSubmit = async ({ content, starPoint }) => {
    if (!isLoggedIn) return;
    await axios.post(`/api/reviews/${reviewId}/comments`,
        { comment: content, starPoint },
        {withCredentials: true}
    );
    try {
      onSuccess?.();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      // 👉 실패 메시지를 띄우고 싶으면 여기서 처리
    }
  };

  return <CommentForm isLoggedIn={isLoggedIn} onSubmit={handleSubmit} commentCount={commentCount} showStarRating={true}/>;
};

export default ReviewCommentForm;
