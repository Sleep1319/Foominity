import { Textarea, Box, Text, Button, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return; // 유효성 검사
    onSubmit(content);
    setContent("");
  };

  return (
    <Box
      maxW="600px"
      mx="auto" // 가운데 정렬
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
    >
      <Text fontWeight="bold" mb={2}>
        댓글 작성
      </Text>
      <Textarea
        placeholder="댓글을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        resize="vertical"
        minH="100px"
        mb={3}
      />
      <Flex justify="flex-end">
        <Button colorScheme="teal" onClick={handleSubmit}>
          등록
        </Button>
      </Flex>
    </Box>
  );
};

export default CommentForm;
