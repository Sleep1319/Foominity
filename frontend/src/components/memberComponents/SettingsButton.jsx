import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  List,
  ListItem,
  Slide,
  useDisclosure,
} from "@chakra-ui/react";
import { HiCog } from "react-icons/hi";
import DeleteModal from "../../view/Member/DeleteModal";
import { useUser } from "../../context/UserContext";

const SettingsButton = ({ items: customItems }) => {
  // 모달 오픈 상태 관리
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // Popover 열림 상태 수동 관리
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { state: user } = useUser();

  // 기본 메뉴 아이템 정의
  const defaultItems = [
    { title: "프로필 편집", href: "/mypage/editprofile" },
    // { title: "비밀번호 변경", href: "/changepassword" },
    ...(user?.socialType == null ? [{ title: "비밀번호 변경", href: "/changepassword" }] : []),
    {
      title: "회원 탈퇴",
      action: () => setDeleteOpen(true),
      styleProps: {
        bg: "white",
        color: "gray.600",
        _hover: { bg: "white", color: "red", borderColor: "white", fontWeight: "semibold" },
      },
    },
  ];

  const items = customItems || defaultItems;

  return (
    <>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-start" trigger="hover" gutter={0}>
        <PopoverTrigger>
          <Button
            variant="outline"
            size="sm"
            borderRadius={0}
            w="130px"
            mb="142px"
            // ml="-45px"
            ml="-68px"
            _hover={{ bg: "white", color: "black" }}
          >
            <HiCog style={{ marginRight: 3 }} />
            회원 정보 수정
          </Button>
        </PopoverTrigger>

        {/* Slide로 PopoverContent를 감싸서 위에서 아래로 애니메이션 */}
        <Slide direction="top" in={isOpen} style={{ zIndex: 10 }} transition="all 0.75s cubic-bezier(0.23, 1, 0.32, 1)">
          <PopoverContent
            mt="0"
            borderRadius="0"
            border="1px solid"
            borderColor="gray.200"
            w="130px"
            bg="white"
            // boxShadow="lg"
          >
            <PopoverBody p={0}>
              <List spacing={0}>
                {items.map(({ title, href, action, styleProps }) => (
                  <ListItem
                    key={title}
                    as={href ? "a" : "button"}
                    href={href}
                    onClick={action}
                    display="block"
                    w="full"
                    textAlign="left"
                    color="gray.600"
                    px={4}
                    py={2}
                    _hover={{
                      bg: "white",
                      color: "black",
                      borderColor: "white",
                      fontWeight: "semibold",
                      ...((styleProps && styleProps._hover) || {}),
                    }}
                    cursor="pointer"
                    {...styleProps}
                  >
                    {title}
                  </ListItem>
                ))}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Slide>
      </Popover>

      {/* 회원 탈퇴 모달 */}
      <DeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
};

export default SettingsButton;
