import { Box } from "@chakra-ui/react";

const SearchIcon = ({ size = 4 }) => (
  <Box
    boxSize={`${size * 6}px`} // 기본 24px (4 * 6)
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <svg
      viewBox="0 0 24 24"
      fill="black"
      stroke="white"
      strokeWidth="1.8"
      xmlns="http://www.w3.org/2000/svg"
      width={`${size * 6}`}
      height={`${size * 6}`}
    >
      <circle cx="11" cy="11" r="6" />
      <line x1="16" y1="16" x2="22" y2="22" strokeLinecap="round" />
    </svg>
  </Box>
);

export default SearchIcon;
