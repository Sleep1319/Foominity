import { Box, Tabs, TabList, TabPanels, Tab,
    TabPanel, Text, List, ListItem } from "@chakra-ui/react";

const CommunityTabs = () => (
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
)

export default CommunityTabs;