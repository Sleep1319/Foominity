import React from "react";
import { Button } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

const RefreshButton = ({ onClick }) => {
  return (
    <Button
      size="sm"
      leftIcon={<RepeatIcon />}
      variant="ghost"
      colorScheme="teal"
      _hover={{ transform: "rotate(10deg)" }}
      onClick={onClick}
    >
      새로고침
    </Button>
  );
};

export default RefreshButton;
