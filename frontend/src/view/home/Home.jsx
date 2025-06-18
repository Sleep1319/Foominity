import {
  Box,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  Spacer,
} from "@chakra-ui/react";

function Home() {
  return (
    <Box maxW="1200px" mx="auto" px={4} py={6}>
      {/* 메인 슬라이더 영역 */}
      <Box mb={8}>
        {/*
        <Image
          src="https://source.unsplash.com/random/1200x400?music"
          alt="Main Slider"
          borderRadius="md"
        />
        */}
        {/* 임시 백그라운드 색상 박스 */}
        <Box display="flex" gap={4} borderRadius="md" overflow="hidden" h="400px">
          <Box flex="1" bg="red.400" />
          <Box flex="1" bg="green.400" />
          <Box flex="1" bg="blue.400" />
          <Box flex="1" bg="yellow.400" />
          <Box flex="1" bg="purple.400" />
        </Box>
        <Text mt={2} fontWeight="bold" fontSize="xl">
          test1
        </Text>
      </Box>

      {/* 카테고리 탭 + 콘텐츠 섹션 */}
      <Tabs variant="soft-rounded" colorScheme="red" mb={8}>
        <TabList>
          <Tab>Review</Tab>
          <Tab>FreeBoard</Tab>
          <Tab>Notice</Tab>
          <Tab>Report</Tab><Tab>Discussion</Tab>
          <Tab>Workspace</Tab>
          <Tab>Shop</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                <Image src="https://source.unsplash.com/random/600x400?fire" />
                <Box p={4}>
                  <Text fontSize="sm" color="gray.500">
                    test1
                  </Text>
                  <Heading size="md" mt={2}>
                    test2
                  </Heading>
                </Box>
              </Box>
              <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                <Image src="https://source.unsplash.com/random/600x400?street" />
                <Box p={4}>
                  <Text fontSize="sm" color="gray.500">
                    test3
                  </Text>
                  <Heading size="md" mt={2}>
                    test4
                  </Heading>
                </Box>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* 각 탭 패널에 임시 텍스트 넣음 */}
          <TabPanel>
            <Text>test1</Text>
          </TabPanel>
          <TabPanel>
            <Text>test2</Text>
          </TabPanel>
          <TabPanel>
            <Text>testTest</Text>
          </TabPanel>
          <TabPanel>
            <Text>abcd</Text>
          </TabPanel>
          <TabPanel>
            <Text>test1</Text>
          </TabPanel>
          <TabPanel>
            <Text>test2</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* 인기글 리스트 */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          오늘의 인기글
        </Heading>
        <List spacing={2}>
          <ListItem>test1</ListItem>
          <ListItem>test2</ListItem>
          <ListItem>test3</ListItem>
          <ListItem>test4</ListItem>
          <ListItem>test5</ListItem>
        </List>
      </Box>

      {/* 커뮤니티 섹션 */}
      <Box mb={8}>
        <Tabs variant="line" colorScheme="red">
          <TabList>
            <Tab>Review</Tab>
            <Tab>FreeBoard</Tab>
            <Tab>Notice</Tab>
            <Tab>Report</Tab>
            <Tab>Discussion</Tab>
            <Tab>Workspace</Tab>
            <Tab>Shop</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <List spacing={2}>
                <ListItem>test1</ListItem>
                <ListItem>test2</ListItem>
                <ListItem>test3</ListItem>
                <ListItem>test4</ListItem>
              </List>
            </TabPanel>
            <TabPanel>
              <Text>test2</Text>
            </TabPanel>
            <TabPanel>
              <Text>testTest</Text>
            </TabPanel>
            <TabPanel>
              <Text>abcd</Text>
            </TabPanel>
            <TabPanel>
              <Text>test1</Text>
            </TabPanel>
            <TabPanel>
              <Text>test2</Text>
            </TabPanel>
            <TabPanel>
              <Text>testTest</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* 푸터 */}
      <Box as="footer" borderTop="1px solid" borderColor="gray.200" py={6} textAlign="center" color="gray.600">
        <Text>© 2025 HIPHOPLE. All rights reserved.</Text>
      </Box>
    </Box>
  );
}

export default Home;
