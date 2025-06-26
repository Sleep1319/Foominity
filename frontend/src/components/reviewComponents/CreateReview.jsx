import React, { useState, useEffect } from "react";
import { Box, Input, Textarea, Button, Select, FormLabel, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateReview = () => {
  const [title, setTitle] = useState("");
  const [released, setReleased] = useState("");
  const [tracklist, setTracklist] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [artistIds, setArtistIds] = useState([]);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get("/api/categories?page=0");
        console.log("카테고리 데이터:", categoryRes.data);
        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
        setCategories([]);
      }

      try {
        const artistRes = await axios.get("/api/artists?page=0");
        console.log("아티스트 content:", artistRes.data.content);
        setArtists(Array.isArray(artistRes.data.content) ? artistRes.data.content : []);
      } catch (err) {
        console.error("아티스트 불러오기 실패:", err);
        setArtists([]);
      }
    };
    fetchData();
  }, []);

  // 이미지 업로드 API 호출 함수
  const handleImageUpload = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post("/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // 서버가 반환하는 이미지 경로 (예: { imagePath: "uploads/abc.jpg" })
      return res.data.imagePath;
    } catch (error) {
      console.error("이미지 업로드 실패", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const imagePath = await handleImageUpload();

      if (!imagePath) {
        alert("이미지 업로드에 실패했습니다.");
        return;
      }

      const reviewData = {
        title,
        released,
        tracklist,
        categoryIds,
        artistIds,
        imagePath, // 이미지 경로 포함
      };

      await axios.post("/api/reviews", reviewData, {
        headers: { "Content-Type": "application/json" },
      });

      navigate("/review");
    } catch (err) {
      console.error("리뷰 등록 실패", err);
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10}>
      <VStack spacing={4}>
        <FormLabel>제목</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />

        <FormLabel>발매일</FormLabel>
        <Input type="date" value={released} onChange={(e) => setReleased(e.target.value)} />

        <FormLabel>트랙리스트</FormLabel>
        <Textarea value={tracklist} onChange={(e) => setTracklist(e.target.value)} />

        <FormLabel>카테고리</FormLabel>
        <Select multiple onChange={(e) => setCategoryIds(Array.from(e.target.selectedOptions, (o) => Number(o.value)))}>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </Select>

        <FormLabel>아티스트</FormLabel>
        <Select multiple onChange={(e) => setArtistIds(Array.from(e.target.selectedOptions, (o) => Number(o.value)))}>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </Select>

        <FormLabel>앨범 이미지</FormLabel>
        <Input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <Button colorScheme="blue" onClick={handleSubmit}>
          등록
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateReview;
