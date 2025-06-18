import { Box, Heading, List, ListItem, Text} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const dummyPopularPosts = [
    { id: 1, title: "🔥 인기글 1", author: "user1" },
    { id: 2, title: "🔥 인기글 2", author: "user2" },
    { id: 3, title: "🔥 인기글 3", author: "user3" },
];

const PopularPosts = () => {
    const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
        //오늘자 리뷰 인기글 5개
        setPopularPosts(dummyPopularPosts); // 가상 데이터 세팅
    }, []);

    return (
        <Box mb={8}>
            <Heading size="md" mb={4}>오늘의 인기글</Heading>
            {popularPosts.length > 0 ? (
                <List spacing={2}>
                    {popularPosts.slice(0, 5).map((post) => (
                        <ListItem key={post.id}>
                            <Text fontWeight="semibold">{post.title}</Text>
                            <Text fontSize="sm" color="gray.500">by {post.author}</Text>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Text color="gray.400">인기글이 없습니다.</Text>
            )}
        </Box>
    );
}

export default PopularPosts;