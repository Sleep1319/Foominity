import {
    Box, Tabs, TabList, TabPanels, Tab,
    TabPanel, Text, List, ListItem, Heading
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const categories = ["Review", "FreeBoard", "Notice"];

const CommunityTabs = () => {
    const [selectedCategory, setSelectedCategory] = useState("Review");
    const [posts, setPosts] = useState([]);

    const fetchPosts = async (category) => {
        try {
            console.log("요청 시작")
            const response = await axios.get(`/api/${category}/latest`);
            const data = response.data;
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("최신글 가져오기 실패", error);
            setPosts([]);
        }
    };

    useEffect(() => {
        fetchPosts(selectedCategory);
    }, [selectedCategory]);

    return (
        <Box mb={8}>
            <Tabs
                variant="line"
                colorScheme="red"
                onChange={(index) => setSelectedCategory(categories[index])}
            >
                <Heading size="md" mb={4}>
                    게시판 종류
                </Heading>
                <TabList>
                    {categories.map((cat) => (
                        <Tab key={cat}>{cat}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                    {categories.map((cat) => (
                        <TabPanel key={cat}>
                            {selectedCategory === cat ? (
                                posts.length > 0 ? (
                                    <List spacing={2}>
                                        {posts.map((post) => (
                                            <ListItem key={post.id}>
                                                <Text fontWeight="semibold">{post.title}</Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    by {post.nickname}
                                                </Text>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Text color="gray.400">등록된 글이 없습니다.</Text>
                                )
                            ) : null}
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default CommunityTabs;