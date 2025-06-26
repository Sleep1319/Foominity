// components/ReviewCommentForm.jsx
import React from "react";
import CommentForm from "./CommentForm.jsx";
import axios from "axios";

const ReviewCommentForm = ({ reviewId, commentCount = 0, onSuccess }) => {
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  const handleSubmit = async (content) => {
    if (!isLoggedIn) return;

    try {
      await axios.post(
        `/api/reviews/${reviewId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onSuccess?.();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      // 👉 실패 메시지를 띄우고 싶으면 여기서 처리
    }
  };

  return <CommentForm isLoggedIn={isLoggedIn} onSubmit={handleSubmit} commentCount={commentCount} />;
};

export default ReviewCommentForm;
