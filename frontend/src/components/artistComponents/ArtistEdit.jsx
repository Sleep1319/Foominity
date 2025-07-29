import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Image,
  Spinner,
  CheckboxGroup,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ArtistEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [born, setBorn] = useState(""); // YYYY-MM-DD
  const [nationality, setNationality] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data || []));

    axios
      .get(`/api/artists/${id}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
        setBorn(data.born || "");
        setNationality(data.nationality || "");
        setSelectedCategoryIds((data.categoryIds || []).map(String));
        if (data.imagePath) {
          setPreviewUrl(`http://localhost:8084/${data.imagePath}`);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("아티스트 불러오기 실패:", err);
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "이름은 필수입니다.", status: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("born", born || "");
    formData.append("nationality", nationality || "");

    selectedCategoryIds.forEach((id) => {
      formData.append("categoryIds", id);
    });

    try {
      await axios.put(`/api/artists/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast({ title: "아티스트 수정 완료", status: "success", duration: 2000 });
      navigate(`/artist/${id}`);
    } catch (err) {
      console.error("수정 실패:", err);
      toast({ title: "수정 실패", status: "error", duration: 2000 });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" mt={10} px={4}>
      <Heading mb={6}>아티스트 수정</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>이름</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </FormControl>

          <FormControl>
            <FormLabel>출생일</FormLabel>
            <Input type="date" value={born} onChange={(e) => setBorn(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>국적</FormLabel>
            <Input value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>카테고리</FormLabel>
            <CheckboxGroup value={selectedCategoryIds} onChange={(val) => setSelectedCategoryIds(val)}>
              <Stack direction="row" wrap="wrap">
                {categories.map((cat) => (
                  <Checkbox key={cat.categoryId} value={String(cat.categoryId)}>
                    {cat.categoryName}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>

          <FormControl>
            <FormLabel>이미지 업로드</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </FormControl>

          {previewUrl && <Image src={previewUrl} alt="preview" boxSize="200px" objectFit="cover" borderRadius="md" />}

          <Button type="submit" colorScheme="blue">
            저장
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ArtistEdit;
