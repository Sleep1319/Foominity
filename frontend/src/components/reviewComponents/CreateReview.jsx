import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  FormLabel,
  VStack,
  FormControl,
  IconButton,
  Flex,
  useDisclosure,
  Image,
  Text,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArtistSearchModal from "../artistComponents/ArtistSearchModal";
import CreateArtistModal from "../artistComponents/CreateArtistModal";
import CheckCreateReviewModal from "./CheckCreateReviewModal";
import AppleMusicSearchModal from "./AppleMusicSearchModal";

const BACKEND_HOST = "http://localhost:8084"; // 서버 포트에 맞게 변경

const CreateReview = () => {
  const [title, setTitle] = useState("");
  const [released, setReleased] = useState("");
  const [trackInputs, setTrackInputs] = useState([{ name: "" }]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(""); // 서버 저장 경로
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const navigate = useNavigate();

  const { isOpen: isAppleOpen, onOpen: onAppleOpen, onClose: onAppleClose } = useDisclosure();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isCheckOpen, onOpen: onCheckOpen, onClose: onCheckClose } = useDisclosure();
  useEffect(() => {
    axios.get("/api/categories?page=0").then((res) => {
      setCategories(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  // Apple Music 앨범 선택 시
  const handleAppleAlbumSelect = async (album) => {
    setTitle(album.title || "");
    setReleased(album.releaseDate ? album.releaseDate.slice(0, 10) : "");
    setImage(null); // 파일 업로드값은 비움

    // iTunes 이미지 → 서버 저장
    if (album.imageUrl) {
      try {
        const res = await axios.post("/api/images/download", { imageUrl: album.imageUrl });
        const { savePath } = res.data;
        setImagePreviewUrl(`${BACKEND_HOST}/${savePath}`);
        setImagePath(savePath);
      } catch (err) {
        setImagePreviewUrl(album.imageUrl);
        setImagePath("");
        console.log("이미지 다운로드 오류: ", err);
      }
    } else {
      setImagePreviewUrl("");
      setImagePath("");
    }

    // 트랙명 자동입력
    if (album.collectionId) {
      try {
        const lookupUrl = `https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song`;
        const res = await fetch(lookupUrl);
        const data = await res.json();
        const tracks = (data.results || [])
          .filter((item) => item.wrapperType === "track")
          .map((track) => ({ name: track.trackName }));
        setTrackInputs(tracks.length > 0 ? tracks : [{ name: "" }]);
      } catch (err) {
        setTrackInputs([{ name: "" }]);
        console.log("트랙명 오류 : ", err);
      }
    } else {
      setTrackInputs([{ name: "" }]);
    }
  };

  // 파일 업로드 input 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePath("");
    setImagePreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  // 리뷰 등록
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("released", released);

    trackInputs.filter((t) => t.name.trim() !== "").forEach((t) => formData.append("tracklist", t.name));
    categoryIds.forEach((id) => formData.append("categoryIds", id));
    selectedArtists.forEach((artist) => formData.append("artistIds", artist.id));

    if (image) {
      formData.append("image", image);
    } else if (imagePath) {
      formData.append("imagePath", imagePath);
    }

    try {
      await axios.post("/api/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      navigate("/review");
    } catch (err) {
      alert("리뷰 등록 중 오류가 발생했습니다.");
      console.log("오류 : ", err);
    }
  };

  const handleArtistSelect = (artist) => {
    if (!selectedArtists.some((a) => a.id === artist.id)) {
      setSelectedArtists((prev) => [...prev, artist]);
    }
  };

  return (
    <>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        pb={2}
        mt={4}
        ml={5}
        height="85px"
      >
        앨범 등록 화면임
      </Text>
      <Box maxW="600px" mx="auto" mt={10}>
        <VStack spacing={4}>
          {/* Apple Music 앨범 검색 - 모달 */}
          <Button w="100%" colorScheme="purple" variant="outline" onClick={onAppleOpen}>
            앨범 정보 검색
          </Button>
          <AppleMusicSearchModal
            isOpen={isAppleOpen}
            onClose={onAppleClose}
            onAlbumSelect={(album) => {
              handleAppleAlbumSelect(album);
              onAppleClose();
            }}
          />

          <FormLabel mt={8} mb={-2}>
            제목
          </FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          <FormLabel mt={8} mb={-2}>
            발매일
          </FormLabel>
          <Input type="date" value={released} onChange={(e) => setReleased(e.target.value)} />

          <FormLabel mt={8} mb={-2}>
            앨범 이미지
          </FormLabel>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreviewUrl && <Image src={imagePreviewUrl} alt="앨범 커버" boxSize="120px" mt={2} borderRadius="md" />}

          <FormLabel mt={8} mb={-2}>
            트랙명
          </FormLabel>
          {trackInputs.map((track, index) => (
            <Box key={index} display="flex" gap={2} alignItems="center" w="100%">
              <Box w="25px">{index + 1}</Box>
              <Input
                placeholder="트랙명"
                value={track.name}
                onChange={(e) => {
                  const newTracks = [...trackInputs];
                  newTracks[index].name = e.target.value;
                  setTrackInputs(newTracks);
                }}
              />
              {trackInputs.length > 1 && (
                <IconButton
                  size="sm"
                  bg="white"
                  icon={<CloseIcon />}
                  aria-label="삭제"
                  _hover={{ bg: "white", color: "black" }}
                  onClick={() => {
                    const newTracks = [...trackInputs];
                    newTracks.splice(index, 1);
                    setTrackInputs(newTracks);
                  }}
                />
              )}
              {index === trackInputs.length - 1 && (
                <Button
                  size="sm"
                  bg="gray.100"
                  color="black"
                  fontSize="lg"
                  _hover={{ bg: "gray.200" }}
                  onClick={() => setTrackInputs([...trackInputs, { name: "" }])}
                >
                  +
                </Button>
              )}
            </Box>
          ))}

          <FormControl>
            <FormLabel textAlign="center" mt={8} mb={2}>
              카테고리
            </FormLabel>
            <CheckboxGroup value={categoryIds.map(String)} onChange={(vals) => setCategoryIds(vals.map(Number))}>
              <Box w="100%">
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                    lg: "1fr 1fr 1fr 1fr",
                  }}
                  gap={3}
                >
                  {categories.map((cat) => (
                    <Checkbox
                      key={cat.categoryId}
                      value={String(cat.categoryId)}
                      p={3}
                      borderRadius="md"
                      _checked={{ bg: "white" }}
                      boxShadow="sm"
                      bg="white"
                    >
                      {cat.categoryName}
                    </Checkbox>
                  ))}
                </Box>
              </Box>
            </CheckboxGroup>
          </FormControl>

          <FormLabel m={0} p={0} mt={8} mb={-5}>
            아티스트
          </FormLabel>
          <Flex gap={2} wrap="wrap">
            {selectedArtists.map((artist) => (
              <Box key={artist.id} p={2} bg="none" borderRadius="md">
                {artist.name}
              </Box>
            ))}
          </Flex>
          <Flex gap={2}>
            <Button bg="gray.100" color="black" w="160px" onClick={onSearchOpen}>
              아티스트 추가
            </Button>
            <Button w="160px" onClick={onCreateOpen}>
              신규 아티스트 생성
            </Button>
          </Flex>
          <ArtistSearchModal isOpen={isSearchOpen} onClose={onSearchClose} onSelect={handleArtistSelect} />
          <CreateArtistModal isOpen={isCreateOpen} onClose={onCreateClose} />

          <Button
            bg="black"
            color="white"
            mb="60px"
            mt="30px"
            _hover={{ bg: "black", color: "white" }}
            onClick={onCheckOpen}
          >
            앨범 등록
          </Button>
        </VStack>
      </Box>
      <CheckCreateReviewModal isOpen={isCheckOpen} onClose={onCheckClose} onConfirm={handleSubmit} />
    </>
  );
};

export default CreateReview;
