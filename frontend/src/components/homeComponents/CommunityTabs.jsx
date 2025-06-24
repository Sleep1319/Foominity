import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Text, List, ListItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import PopularPosts from "@/components/homeComponents/PopularPosts";

const categories = ["Review", "FreeBoard"];

const CommunityTabs = () => {
  const [selectedCategory, setSelectedCategory] = useState("Review");
  const [posts, setPosts] = useState([]);

  const fetchPosts = async (category) => {
    try {
      const response = await axios.get(`/api/${category}/latest`);
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("게시글 가져오기 실패", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts(selectedCategory);
  }, [selectedCategory]);

  return (
    <Box maxW="1500px" mx="auto" px={4} mb={12}>
      <Box display="flex">
        {/* 왼쪽 게시판 탭 */}
        <Box flex={1}>
          <Tabs variant="line" colorScheme="black" onChange={(index) => setSelectedCategory(categories[index])}>
            <TabList>
              {categories.map((cat) => (
                <Tab key={cat} fontWeight="semibold" _hover={{ bg: "transparent" }}>
                  {cat}
                </Tab>
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

        {/* 중앙 세로 구분선 */}
        <Box w="1px" bg="white" mx={6} />

        {/* 오른쪽 인기 댓글 */}
        <Box flex={1}>
          <Tabs variant="line" colorScheme="black" isManual index={0}>
            <TabList>
              <Tab fontWeight="semibold" fontSize="15px" _hover={{ bg: "transparent" }}>
                인기 댓글
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel pt={4}>
                <PopularPosts />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityTabs;
