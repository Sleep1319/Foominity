import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  FormLabel,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  CheckboxGroup,
  FormControl,
  IconButton,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArtistSearchModal from "../artistComponents/ArtistSearchModal";
import CreateArtistModal from "../artistComponents/CreateArtistModal";

const CreateReview = () => {
  const [title, setTitle] = useState("");
  const [released, setReleased] = useState("");
  const [trackInputs, setTrackInputs] = useState([{ name: "" }]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  useEffect(() => {
    axios.get("/api/categories?page=0").then((res) => {
      setCategories(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("released", released);

    trackInputs.filter((t) => t.name.trim() !== "").forEach((t) => formData.append("tracklist", t.name));

    categoryIds.forEach((id) => formData.append("categoryIds", id));
    selectedArtists.forEach((artist) => formData.append("artistIds", artist.id));

    try {
      await axios.post("/api/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      navigate("/review");
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  const handleArtistSelect = (artist) => {
    if (!selectedArtists.some((a) => a.id === artist.id)) {
      setSelectedArtists((prev) => [...prev, artist]);
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10}>
      <VStack spacing={4}>
        <FormLabel>제목</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />

        <FormLabel>발매일</FormLabel>
        <Input type="date" value={released} onChange={(e) => setReleased(e.target.value)} />

        <FormLabel>트랙명</FormLabel>
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
                icon={<CloseIcon />}
                aria-label="삭제"
                onClick={() => {
                  const newTracks = [...trackInputs];
                  newTracks.splice(index, 1);
                  setTrackInputs(newTracks);
                }}
              />
            )}
            {index === trackInputs.length - 1 && (
              <Button size="sm" colorScheme="purple" onClick={() => setTrackInputs([...trackInputs, { name: "" }])}>
                +
              </Button>
            )}
          </Box>
        ))}

        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Menu closeOnSelect={false}>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
              {categoryIds.length === 0
                ? "선택"
                : categories
                    .filter((cat) => categoryIds.includes(cat.categoryId))
                    .map((cat) => cat.categoryName)
                    .join(", ")}
            </MenuButton>
            <MenuList maxH="200px" overflowY="auto">
              <CheckboxGroup value={categoryIds.map(String)} onChange={(vals) => setCategoryIds(vals.map(Number))}>
                {categories.map((cat) => (
                  <MenuItem key={cat.categoryId} as="div">
                    <Checkbox value={String(cat.categoryId)}>{cat.categoryName}</Checkbox>
                  </MenuItem>
                ))}
              </CheckboxGroup>
            </MenuList>
          </Menu>
        </FormControl>

        <FormLabel>아티스트</FormLabel>
        <Flex gap={2} wrap="wrap">
          {selectedArtists.map((artist) => (
            <Box key={artist.id} p={2} bg="gray.100" borderRadius="md">
              {artist.name}
            </Box>
          ))}
        </Flex>
        <Flex gap={2}>
          <Button colorScheme="purple" onClick={onSearchOpen}>
            아티스트 추가
          </Button>
          <Button onClick={onCreateOpen}>신규 아티스트 생성</Button>
        </Flex>
        <ArtistSearchModal isOpen={isSearchOpen} onClose={onSearchClose} onSelect={handleArtistSelect} />
        <CreateArtistModal isOpen={isCreateOpen} onClose={onCreateClose} />

        <FormLabel>앨범 이미지</FormLabel>
        <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <Button colorScheme="blue" onClick={handleSubmit}>
          등록
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateReview;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Input,
//   Button,
//   FormLabel,
//   VStack,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Checkbox,
//   CheckboxGroup,
//   FormControl,
//   IconButton,
//   Flex,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ArtistSearchModal from "../artistComponents/ArtistSearchModal";
// import CreateArtistModal from "../artistComponents/CreateArtistModal";

// const CreateReview = () => {
//   const [title, setTitle] = useState("");
//   const [released, setReleased] = useState("");
//   const [trackInputs, setTrackInputs] = useState([{ name: "", language: "" }]);
//   const [categoryIds, setCategoryIds] = useState([]);
//   const [selectedArtists, setSelectedArtists] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [image, setImage] = useState(null);

//   const navigate = useNavigate();
//   const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
//   const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

//   useEffect(() => {
//     axios.get("/api/categories?page=0").then((res) => {
//       setCategories(Array.isArray(res.data) ? res.data : []);
//     });
//   }, []);

//   const handleImageUpload = async () => {
//     if (!image) return null;
//     const formData = new FormData();
//     formData.append("file", image);

//     try {
//       const res = await axios.post("/api/reviews", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
//       console.log("업로드된 이미지 경로:", res.data.imagePath);
//       return res.data.imagePath;
//     } catch (err) {
//       console.error("이미지 업로드 실패:", err);
//       return null;
//     }
//   };

//   const handleSubmit = async () => {
//     const imagePath = await handleImageUpload();
//     if (!imagePath) {
//       alert("이미지 업로드 실패");
//       return;
//     }

//     const reviewData = {
//       title,
//       released,
//       categoryIds,
//       artistIds: selectedArtists.map((a) => a.id),
//       imagePath,
//       tracklist: trackInputs.filter((t) => t.name.trim() !== ""),
//     };

//     try {
//       await axios.post("/api/reviews", reviewData, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });
//       navigate("/review");
//     } catch (err) {
//       console.error("리뷰 등록 실패", err);
//     }
//   };

//   const handleArtistSelect = (artist) => {
//     if (!selectedArtists.some((a) => a.id === artist.id)) {
//       setSelectedArtists((prev) => [...prev, artist]);
//     }
//   };

//   return (
//     <Box maxW="600px" mx="auto" mt={10}>
//       <VStack spacing={4}>
//         <FormLabel>제목</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>발매일</FormLabel>
//         <Input type="date" value={released} onChange={(e) => setReleased(e.target.value)} />

//         <FormLabel>트랙명</FormLabel>
//         {trackInputs.map((track, index) => (
//           <Box key={index} display="flex" gap={2} alignItems="center" w="100%">
//             <Box w="25px">{index + 1}</Box>
//             <Input
//               placeholder="트랙명"
//               value={track.name}
//               onChange={(e) => {
//                 const newTracks = [...trackInputs];
//                 newTracks[index].name = e.target.value;
//                 setTrackInputs(newTracks);
//               }}
//             />
//             {trackInputs.length > 1 && (
//               <IconButton
//                 size="sm"
//                 icon={<CloseIcon />}
//                 aria-label="삭제"
//                 onClick={() => {
//                   const newTracks = [...trackInputs];
//                   newTracks.splice(index, 1);
//                   setTrackInputs(newTracks);
//                 }}
//               />
//             )}
//             {index === trackInputs.length - 1 && (
//               <Button
//                 size="sm"
//                 colorScheme="purple"
//                 onClick={() => setTrackInputs([...trackInputs, { name: "", language: "" }])}
//               >
//                 +
//               </Button>
//             )}
//           </Box>
//         ))}

//         <FormControl>
//           <FormLabel>카테고리</FormLabel>
//           <Menu closeOnSelect={false}>
//             <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
//               {categoryIds.length === 0
//                 ? "선택"
//                 : categories
//                     .filter((cat) => categoryIds.includes(cat.categoryId))
//                     .map((cat) => cat.categoryName)
//                     .join(", ")}
//             </MenuButton>
//             <MenuList maxHeight="200px" overflowY="auto">
//               <CheckboxGroup value={categoryIds.map(String)} onChange={(values) => setCategoryIds(values.map(Number))}>
//                 {categories.map((cat) => (
//                   <MenuItem key={cat.categoryId} as="div">
//                     <Checkbox value={String(cat.categoryId)}>{cat.categoryName}</Checkbox>
//                   </MenuItem>
//                 ))}
//               </CheckboxGroup>
//             </MenuList>
//           </Menu>
//         </FormControl>

//         <FormLabel>아티스트</FormLabel>
//         <Flex gap={2} wrap="wrap">
//           {selectedArtists.map((artist) => (
//             <Box key={artist.id} p={2} bg="gray.100" borderRadius="md">
//               {artist.name}
//             </Box>
//           ))}
//         </Flex>

//         <Flex gap={2}>
//           <Button colorScheme="purple" onClick={onSearchOpen}>
//             아티스트 추가
//           </Button>
//           <Button onClick={onCreateOpen}>신규 아티스트 생성</Button>
//         </Flex>

//         <ArtistSearchModal isOpen={isSearchOpen} onClose={onSearchClose} onSelect={handleArtistSelect} />
//         <CreateArtistModal isOpen={isCreateOpen} onClose={onCreateClose} />

//         <FormLabel>앨범 이미지</FormLabel>
//         <Input type="file" onChange={(e) => setImage(e.target.files[0])} />

//         <Button colorScheme="blue" onClick={handleSubmit}>
//           등록
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default CreateReview;
