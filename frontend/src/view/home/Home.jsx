import { Box } from "@chakra-ui/react";
import CategoryTabs from "@/components/homeComponents/CategoryTabs.jsx";
import CommunityTabs from "@/components/homeComponents/CommunityTabs.jsx";
import PopularPosts from "@/components/homeComponents/PopularPosts.jsx";
import SliderBox from "@/components/homeComponents/SliderBox.jsx";


function Home() {
  return (
    <>
      <SliderBox/>
    <Box maxW="1200px" mx="auto" px={4} py={6}>
      <CategoryTabs />
      <PopularPosts />
      <CommunityTabs />
    </Box>
    </>
  );
}

export default Home;
