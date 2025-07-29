import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Button,
  FormLabel,
  FormControl,
  Checkbox,
  CheckboxGroup,
  Stack,
  useToast,
  Image,
} from "@chakra-ui/react";
import axios from "axios";

const CreateArtistModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    born: "",
    nationality: "",
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !image) {
      toast({
        title: "입력 누락",
        description: "이름과 이미지를 모두 입력해주세요.",
        status: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.trim()); // 이름
    if (form.born) formData.append("born", form.born); // 출생년도
    if (form.nationality) formData.append("nationality", form.nationality); // 출생지
    form.categoryIds.forEach((id) => formData.append("categoryIds", id)); // 카테고리
    formData.append("image", image); // 이미지

    // console.log("🚀 생성 요청 데이터:", payload); 디버깅용

    try {
      await axios.post("/api/artists", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // 인증 쿠키 전송
      });
      toast({ title: "아티스트가 생성되었습니다.", status: "success" });
      onClose();
    } catch (err) {
      toast({
        title: "생성 실패",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>신규 아티스트 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={3} isRequired>
            <FormLabel>이름</FormLabel>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="아티스트 이름"
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>출생일</FormLabel>
            <Input type="date" value={form.born} onChange={(e) => setForm({ ...form, born: e.target.value })} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>국적</FormLabel>
            <Input
              value={form.nationality}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
              placeholder="예: Korea, Japan 등"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>카테고리</FormLabel>
            <CheckboxGroup value={form.categoryIds} onChange={(val) => setForm({ ...form, categoryIds: val })}>
              <Stack direction="row" wrap="wrap">
                {categories.map((cat) => (
                  <Checkbox key={cat.categoryId} value={String(cat.categoryId)}>
                    {cat.categoryName}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>아티스트 이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                setPreviewUrl(file ? URL.createObjectURL(file) : "");
              }}
            />
            {previewUrl && <Image src={previewUrl} alt="미리보기" boxSize="120px" mt={2} borderRadius="md" />}
          </FormControl>

          <Button colorScheme="purple" onClick={handleSubmit} w="full">
            생성
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateArtistModal;
