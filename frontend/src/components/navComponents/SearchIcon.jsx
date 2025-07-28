import { Icon } from "@chakra-ui/react";

const SearchIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Icon>
);

export default SearchIcon;
