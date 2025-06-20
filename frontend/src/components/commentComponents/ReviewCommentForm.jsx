// components/ReviewCommentForm.jsx
import CommentForm from "./CommentForm.jsx";
import axios from "axios";

const ReviewCommentForm = ({ reviewId, onSuccess }) => {
  const handleSubmit = async (content) => {
    await axios.post(`/api/reviews/${reviewId}/comments`, { content });
    onSuccess?.();
  };

  return <CommentForm onSubmit={handleSubmit} />;
};

export default ReviewCommentForm;
