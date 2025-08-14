import React, { useMemo, useState } from "react";
import { Box, HStack, Input, IconButton } from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";

const RpeortSearchBar = ({ onSearch, defaultValue = "", width = "320px" }) => {
  const [value, setValue] = useState(defaultValue);

  const clearable = useMemo(() => value.length > 0, [value]);

  const handleSearch = () => {
    onSearch?.(value.trim());
  };

  return (
    <Box>
      <HStack spacing={2}>
        <Input
          placeholder="제목 또는 작성자 검색"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          bg="white"
          border="1px solid black"
          _focus={{ boxShadow: "none", borderColor: "black" }}
          size="sm"
          w={width}
        />

        {clearable ? (
          <IconButton
            aria-label="clear"
            icon={<CloseIcon boxSize="2" />}
            size="sm"
            onClick={() => {
              setValue("");
              onSearch?.("");
            }}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
          />
        ) : (
          <IconButton
            aria-label="search"
            icon={<SearchIcon />}
            size="sm"
            onClick={handleSearch}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
          />
        )}
      </HStack>
    </Box>
  );
};

export default RpeortSearchBar;
