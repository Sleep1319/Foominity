import { Box, Heading, List, ListItem } from "@chakra-ui/react";

const PopularPosts = () => (
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
)

export default PopularPosts;