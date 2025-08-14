import React, { useState } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";

const statusOptions = [
  { value: "PENDING", label: "대기 중" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "RESOLVED", label: "처리 완료" },
  { value: "REJECTED", label: "거절됨" },
];

export default function ReportStatusControl({ reportId, value, onChanged }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const currentLabel = statusOptions.find((o) => o.value === value)?.label || "상태 선택";

  const update = async (next) => {
    try {
      setLoading(true);
      await axios.put(`/api/report/${reportId}/status`, { status: next }, { withCredentials: true });
      onChanged?.(next);
      toast({ title: "상태가 변경되었습니다.", status: "success", duration: 1200, isClosable: true });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast({ title: "상태 변경 실패", description: msg, status: "error", duration: 1800, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        size="sm"
        isLoading={loading}
        bg="black"
        color="white"
        _hover={{ bg: "gray.800" }}
        fontWeight="semibold"
        borderRadius="999px"
      >
        {currentLabel}
      </MenuButton>
      <MenuList>
        {statusOptions.map(({ value, label }) => (
          <MenuItem key={value} onClick={() => update(value)}>
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
