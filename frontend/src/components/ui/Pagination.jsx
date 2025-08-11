import { HStack, Button, Text } from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const range = 2; // 현재 페이지 기준 앞뒤로 몇 개 보여줄지
    const start = Math.max(0, currentPage - range);
    const end = Math.min(totalPages - 1, currentPage + range);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <HStack justify="center" spacing={2} mt={8} wrap="wrap">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 0}
        leftIcon={<BsChevronLeft />}
        size="sm"
      >
        이전
      </Button>

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? "solid" : "outline"}
          size="sm"
        >
          {page + 1}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage >= totalPages - 1}
        rightIcon={<BsChevronRight />}
        size="sm"
      >
        다음
      </Button>
    </HStack>
  );
};

export default Pagination;
