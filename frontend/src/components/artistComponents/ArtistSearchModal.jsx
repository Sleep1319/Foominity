import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Image,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  IconButton,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";

const API_HOST = "http://localhost:8084";

const ArtistSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 모달 닫힐 때 초기화 (원하면 제거 가능)
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      setLoading(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("/api/artists", {
        params: { page: 0, size: 50, search: term },
      });
      setResults(res.data?.content ?? []);
    } catch (err) {
      console.error("아티스트 검색 실패", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh" overflow="hidden">
        <ModalHeader>아티스트 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxH="70vh">
          <Flex gap={2} mb={4}>
            <Input
              placeholder="아티스트명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <IconButton aria-label="아티스트 검색" icon={<SearchIcon />} onClick={handleSearch} isLoading={loading} />
          </Flex>

          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>선택</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading && (
                <Tr>
                  <Td colSpan={2}>
                    <Flex align="center" gap={2}>
                      <Spinner size="sm" />
                      <Text>검색 중…</Text>
                    </Flex>
                  </Td>
                </Tr>
              )}

              {!loading && results.length === 0 && (
                <Tr>
                  <Td colSpan={2}>
                    <Text color="gray.500">검색 결과가 없습니다.</Text>
                  </Td>
                </Tr>
              )}

              {!loading &&
                results.map((artist) => (
                  <Tr key={artist.id}>
                    <Td>
                      <Flex align="center" gap={3}>
                        <Image
                          src={artist.imagePath ? `${API_HOST}/${artist.imagePath}` : "/default-avatar.png"}
                          alt={artist.name}
                          boxSize="40px"
                          objectFit="cover"
                          borderRadius="full"
                        />
                        <Text>{artist.name}</Text>
                      </Flex>
                    </Td>
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
