import React from "react";
// import { useNavigate } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";

const BoardHeading = () => {
  // const navigate = useNavigate();
  return (
    <div>
      <Flex align="center" justify="space-between" mb={6}>
        <Heading as="h2" size="xl" cursor="pointer" onClick={() => window.location.reload()}>
          자유게시판
        </Heading>
        {/* <Heading as="h2" size="xl" cursor="pointer" onClick={() => navigate("/board")}>
          자유게시판
        </Heading> */}
      </Flex>
    </div>
  );
};

export default BoardHeading;
