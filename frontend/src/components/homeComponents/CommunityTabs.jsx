import {
    Box, Tabs, TabList, TabPanels, Tab,
    TabPanel, Text, List, ListItem, Heading
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const categories = [
    "Review", "FreeBoard", "Notice", "Report", "Discussion", "Workspace", "Shop"
];

const dummyData = {
    Review: [
        { id: 1, title: "리뷰 글 1", author: "userA" },
        { id: 2, title: "리뷰 글 2", author: "userB" },
    ],
    FreeBoard: [],
    Notice: [
        { id: 3, title: "공지사항", author: "admin" },
    ],
    // 나머지도 유사하게 세팅
};

const CommunityTabs = () => {
    const [postsByCategory, setPostsByCategory] = useState({});

    useEffect(() => {
        //요청식 필요
        setPostsByCategory(dummyData); // 가상 데이터 세팅
    }, []);
    return (
        <Box mb={8}>
            <Tabs variant="line" colorScheme="red">
                <Heading size="md" mb={4}>
                    최신 글
                </Heading>
                <TabList>
                    {categories.map((cat) => (
                        <Tab key={cat}>{cat}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                    {categories.map((cat) => (
                        <TabPanel key={cat}>
                            {postsByCategory[cat]?.length > 0 ? (
                                <List spacing={2}>
                                    {postsByCategory[cat].slice(0, 4).map((post) => (
                                        <ListItem key={post.id}>
                                            <Text fontWeight="semibold">{post.title}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                by {post.author}
                                            </Text>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Text color="gray.400">등록된 글이 없습니다.</Text>
                            )}
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default CommunityTabs;