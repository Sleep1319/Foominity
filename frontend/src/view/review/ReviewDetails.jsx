import React from "react";
import ReviewDetail from "../../components/reviewComponents/ReviewDetail.jsx";
import ReviewCommentForm from "@/components/commentComponents/ReviewCommentForm.jsx";

const ReviewDetails = () => {
  return (
    <div>
      <ReviewDetail />
        <ReviewCommentForm />
    </div>
  );
};

export default ReviewDetails;
