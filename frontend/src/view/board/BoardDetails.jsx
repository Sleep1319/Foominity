import React from "react";
import BoardDetail from "./../../components/boardComponents/BoardDetail";
import BoardList from "./../../components/boardComponents/BoardList";
import { Box } from "@chakra-ui/react";

const BoardDetails = () => {
  return (
    <div>
      <BoardDetail />
      <BoardList />
    </div>
  );
};

export default BoardDetails;
