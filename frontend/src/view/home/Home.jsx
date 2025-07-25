import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import SliderBox from "@/components/homeComponents/SliderBox.jsx";
import CommunityTabs from "@/components/homeComponents/CommunityTabs.jsx";
import { motion } from "framer-motion";
import TopRankedAlbums from "../../components/reviewComponents/TopRankedAlbums";
import AppNavbar from "../../layouts/AppNavBar";

const MotionBox = motion(Box);

function Home() {
  const categoryRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollLock = useRef(false);
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollLock.current) return;

      const currentY = window.scrollY;
      const direction = currentY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = currentY;

      const downThreshold = window.innerHeight * 0.15;
      const upThreshold = window.innerHeight * 0.3;

      if (direction === "down" && currentY > downThreshold && !showTabs) {
        scrollLock.current = true;
        const target = categoryRef.current;
        if (target) {
          window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
          setTimeout(() => {
            setShowTabs(true);
            scrollLock.current = false;
          }, 600);
        }
      }

      if (direction === "up" && currentY < upThreshold && showTabs) {
        scrollLock.current = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          setShowTabs(false);
          scrollLock.current = false;
        }, 600);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showTabs]);

  return (
    <>
      <AppNavbar />
      <SliderBox />

      <Box ref={categoryRef} mt={20}>
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          animate={showTabs ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
        >
          <Box position="sticky" top="0" zIndex={999} bg="white" boxShadow="none">
            <Box maxW="1200px" mx="auto" px={4} py={6} display="flex" justifyContent="center"></Box>
          </Box>
        </MotionBox>

        <TopRankedAlbums />
        <Box h="40px" />
        <CommunityTabs />
        <Box maxW="1200px" mx="auto" px={4} py={6}>
          {/* <PopularPosts /> */}
          <Box h="600px" />
        </Box>
      </Box>
    </>
  );
}

export default Home;
