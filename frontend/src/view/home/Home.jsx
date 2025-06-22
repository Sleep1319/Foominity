import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import SliderBox from "@/components/homeComponents/SliderBox.jsx";
import CategoryTabs from "@/components/homeComponents/CategoryTabs.jsx";
import PopularPosts from "@/components/homeComponents/PopularPosts.jsx";
import CommunityTabs from "@/components/homeComponents/CommunityTabs.jsx";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function Home() {
  const categoryRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollLock = useRef(false); // ✅ 스크롤 중복 방지용 상태
  const [showTabs, setShowTabs] = useState(false); // 애니메이션 제어용

  useEffect(() => {
    const handleScroll = () => {
      if (scrollLock.current) return;

      const currentY = window.scrollY;
      const direction = currentY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = currentY;

      const snapThreshold = window.innerHeight * 0.15;

      // 아래로 → 카테고리 전환
      if (direction === "down" && currentY > snapThreshold && !showTabs) {
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

      // 위로 → 슬라이더 복귀
      if (direction === "up" && currentY < snapThreshold && showTabs) {
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
      <SliderBox />

      {/* 카테고리 영역 */}
      <Box ref={categoryRef}>
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          animate={showTabs ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            position="sticky"
            top="0"
            zIndex={999}
            bg="white"
            boxShadow="md"
          >
            <Box maxW="1200px" mx="auto" px={4} py={6}>
              <CategoryTabs />
            </Box>
          </Box>
        </MotionBox>

        <Box maxW="1200px" mx="auto" px={4} py={6}>
          <PopularPosts />
          <CommunityTabs />

          {/* 아래 공간 확보해서 위로 복귀 가능하게 */}
          <Box h="600px" />
        </Box>
      </Box>
    </>
  );
}

export default Home;
