import { Box, Heading, List, ListItem, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const PopularPosts = () => {
    const [popularPosts, setPopularPosts] = useState([]);
    const [state, setState] = useState(true)

    useEffect(() => {
        const fetchPopularPosts = async () => {
            try {
                const response = await axios.get("/api/reviews/top");
                setPopularPosts(response.data);
            } catch (error) {
                console.log()
            } finally {
                setState(false)
            }
        }
        fetchPopularPosts();
    }, []);

    return (
        <Box mb={8}>
            <Heading size="md" mb={4}>오늘의 인기글</Heading>
            {state ? (
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