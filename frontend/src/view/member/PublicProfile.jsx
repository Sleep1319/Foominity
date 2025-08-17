import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  HStack,
  Flex,
  Spinner,
  Center,
  Icon,
  Grid,
  Heading,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUser, FaUserTag, FaMusic } from "react-icons/fa";
import PublicProfilePostsTable from "../../components/memberComponents/PublicProfilePostsTable";
import PublicProfileLikedAlbums from "../../components/memberComponents/PublicProfileLikedAlbums";

// 재사용 가능한 미니멀 카드 컴포넌트 (호버 반응 제거)
const SectionCard = ({ title, right, children }) => {
  const border = useColorModeValue("blackAlpha.200", "whiteAlpha.300");
  const bg = useColorModeValue("white", "black");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      rounded="2xl"
      p={{ base: 4, md: 6 }}
    >
      <HStack justify="space-between" align="center" mb={3}>
        <Heading as="h3" size="md" fontWeight="semibold" letterSpacing="-0.01em">
          {title}
        </Heading>
        {right ? <Box>{right}</Box> : null}
      </HStack>
      <Divider borderColor={border} />
      <Box mt={{ base: 4, md: 5 }}>{children}</Box>
    </Box>
  );
};

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteGenre, setFavoriteGenre] = useState("");

  // 프로필 정보 로드
  useEffect(() => {
    axios
      .get(`/api/users/${id}/profile`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("유저 정보 불러오기 실패", err))
      .finally(() => setLoading(false));
  }, [id]);

  // 장르 통계 로드 → 가장 선호 장르 추출
  useEffect(() => {
    axios
      .get(`/api/member/${id}/genre-stats`, { withCredentials: true })
      .then((res) => {
        const stats = res.data.map(({ genre, count }) => ({ genre, count }));
        if (stats.length > 0) {
          const top = stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0]);
          setFavoriteGenre(top.genre);
        }
      })
      .catch((err) => console.error("장르 통계 불러오기 실패", err));
  }, [id]);

  if (loading) {
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!profile) {
    return (
      <Center mt={20}>
        <Text>유저 정보를 불러올 수 없습니다.</Text>
      </Center>
    );
  }

  const avatarUrl = profile.avatar
    ? `http://localhost:8084${profile.avatar}`
    : "/src/assets/images/defaultProfile.jpg";

  return (
    <Box maxW="1300px" mx="auto" mt={12} p={6}>
      <Text
        lineHeight="2.5"
        textAlign="center"
        fontSize="3xl"
        fontWeight="medium"
        borderBottom="2px solid gray"
        pb={2}
        mt={4}
        ml={16}
      >
        {profile.nickname}님의 프로필
      </Text>

      {/* 프로필 정보 (그대로 유지) */}
      <Flex maxW="3xl" mx="auto" mt={12} mb={8} align="center" justify="center">
        <Avatar border="1px solid gray" boxSize="12rem" src={avatarUrl} />
        <VStack align="start" spacing={5} ml={10}>
          <HStack>
            <Icon as={FaUser} />
            <Text fontWeight="bold" w="80px">
              닉네임
            </Text>
            <Text h="32px" lineHeight="32px">
              {profile.nickname}
            </Text>
          </HStack>
          <HStack>
            <Icon as={FaUserTag} />
            <Text fontWeight="bold" w="80px">
              등급
            </Text>
            <Text>{profile.roleName}</Text>
          </HStack>
          <HStack>
            <Icon as={FaMusic} />
            <Text fontWeight="bold" w="120px">
              선호하는 장르
            </Text>
            <Text>{favoriteGenre || "-"}</Text>
          </HStack>
        </VStack>
      </Flex>

      {/* 좋아요 앨범 + 게시글 (미니멀 카드 레이아웃, 반응형 1→2열) */}
      <Box mt={12} minH="470px">
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 5, md: 6 }}
          alignItems="start"
        >
          <SectionCard title="좋아요한 앨범">
            <PublicProfileLikedAlbums />
          </SectionCard>

          <SectionCard title="작성한 글">
            <PublicProfilePostsTable />
          </SectionCard>
        </Grid>
      </Box>
    </Box>
  );
};

export default PublicProfile;


// import React, { useState, useEffect } from "react";
// import { Box, Avatar, Text, VStack, HStack, Flex, Spinner, Center, Icon } from "@chakra-ui/react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { FaUser, FaUserTag, FaGlobe, FaMusic } from "react-icons/fa";
// import PublicProfilePostsTable from "../../components/memberComponents/PublicProfilePostsTable";
// import PublicProfileLikedAlbums from "../../components/memberComponents/PublicProfileLikedAlbums";

// const PublicProfile = () => {
//   const { id } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [favoriteGenre, setFavoriteGenre] = useState("");

//   // 프로필 정보 로드
//   useEffect(() => {
//     axios
//       .get(`/api/users/${id}/profile`)
//       .then((res) => setProfile(res.data))
//       .catch((err) => console.error("유저 정보 불러오기 실패", err))
//       .finally(() => setLoading(false));
//   }, [id]);

//   // 장르 통계 로드 → 가장 선호 장르 추출
//   useEffect(() => {
//     axios
//       .get(`/api/member/${id}/genre-stats`, { withCredentials: true })
//       .then((res) => {
//         const stats = res.data.map(({ genre, count }) => ({ genre, count }));
//         if (stats.length > 0) {
//           const top = stats.reduce((p, c) => (c.count > p.count ? c : p), stats[0]);
//           setFavoriteGenre(top.genre);
//         }
//       })
//       .catch((err) => console.error("장르 통계 불러오기 실패", err));
//   }, [id]);

//   if (loading) {
//     return (
//       <Center mt={20}>
//         <Spinner size="xl" />
//       </Center>
//     );
//   }

//   if (!profile) {
//     return (
//       <Center mt={20}>
//         <Text>유저 정보를 불러올 수 없습니다.</Text>
//       </Center>
//     );
//   }

//   const avatarUrl = profile.avatar ? `http://localhost:8084${profile.avatar}` : "/src/assets/images/defaultProfile.jpg";

//   return (
//     <Box maxW="1300px" mx="auto" mt={12} p={6}>
//       <Text
//         lineHeight="2.5"
//         textAlign="center"
//         fontSize="3xl"
//         fontWeight="medium"
//         borderBottom="2px solid gray"
//         pb={2}
//         mt={4}
//         ml={16}
//       >
//         {profile.nickname}님의 프로필
//       </Text>

//       {/* 프로필 정보 */}
//       <Flex maxW="3xl" mx="auto" mt={12} mb={8} align="center" justify="center">
//         <Avatar border="1px solid gray" boxSize="12rem" src={avatarUrl} />
//         <VStack align="start" spacing={5} ml={10}>
//           <HStack>
//             <Icon as={FaUser} />
//             <Text fontWeight="bold" w="80px">
//               닉네임
//             </Text>
//             <Text h="32px" lineHeight="32px">
//               {profile.nickname}
//             </Text>
//           </HStack>
//           <HStack>
//             <Icon as={FaUserTag} />
//             <Text fontWeight="bold" w="80px">
//               등급
//             </Text>
//             <Text>{profile.roleName}</Text>
//           </HStack>
//           <HStack>
//             <Icon as={FaMusic} />
//             <Text fontWeight="bold" w="120px">
//               선호하는 장르
//             </Text>
//             <Text>{favoriteGenre || "-"}</Text>
//           </HStack>
//         </VStack>
//       </Flex>

//       {/* 좋아요 앨범 + 게시글 */}
//       <Box mt={12} minH="470px">
//         <Flex>
//           <Box flex="1" p={8}>
//             <PublicProfileLikedAlbums />
//           </Box>
//           <Box flex="1" p={8}>
//             <PublicProfilePostsTable />
//           </Box>
//         </Flex>
//       </Box>
//     </Box>
//   );
// };

// export default PublicProfile;

