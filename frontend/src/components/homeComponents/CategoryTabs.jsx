import { Box, Tabs, TabList, TabPanels, Tab, TabPanel,
    SimpleGrid, Image, Heading, Text } from "@chakra-ui/react";
// 추후 카테고리로 바뀔곳
const CategoryTabs = () => (
    <Tabs variant="soft-rounded" colorScheme="red" mb={8}>
        <TabList>
            <Tab>카테고리별 보여주기로 바뀔곳</Tab>
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
)

export default CategoryTabs;