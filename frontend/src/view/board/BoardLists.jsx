import React from "react";
import BoardList from "./../../components/boardComponents/BoardList";
import BoardHeading from "./../../components/boardComponents/BoardHeading";
import { Box } from "@chakra-ui/react";

const BoardLists = () => {
  return (
    <Box mt={100}>
      <Box ml={350}>
        <BoardHeading />
      </Box>
      <BoardList />
    </Box>
  );
};

export default BoardLists;
