import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";

const ArtistSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/artists?page=0`);
      const filtered = res.data.content.filter((artist) =>
        artist[searchType]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } catch (err) {
      console.error("아티스트 검색 실패", err);
      setResults([]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>아티스트 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={2} mb={4}>
            <Select w="200px" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="name">아티스트명</option>
              <option value="nationality">국적</option>
            </Select>
            <Input placeholder="검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <IconButton icon={<SearchIcon />} onClick={handleSearch} />
          </Flex>

          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>출생일</Th>
                <Th>국적</Th>
                <Th>선택</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((artist) => (
                <Tr key={artist.id}>
                  <Td>{artist.name}</Td>
                  <Td>{artist.born}</Td>
                  <Td>{artist.nationality}</Td>
                  <Td>
                    <Button
                      size="sm"
                      onClick={() => {
                        onSelect(artist);
                        onClose();
                      }}
                    >
                      선택
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ArtistSearchModal;
