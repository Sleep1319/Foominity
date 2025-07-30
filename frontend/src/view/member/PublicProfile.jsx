import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Avatar, Text, VStack, HStack, Flex, Spinner, Center, Icon, Divider } from "@chakra-ui/react";
import axios from "axios";
import { FaUser, FaUserTag, FaGlobe } from "react-icons/fa";
import OtherUserLikedAlbums from "../../components/memberComponents/PublicProfileLikedAlbums";
import MyPostsTable from "../../components/memberComponents/MyPostsTable";
import PublicProfilePostsTable from "../../components/memberComponents/PublicProfilePostsTable";
import PublicProfileLikedAlbums from "../../components/memberComponents/PublicProfileLikedAlbums";

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/users/${id}/profile`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("유저 정보 불러오기 실패", err))
      .finally(() => setLoading(false));
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

  const avatarUrl = profile.avatar ? `http://localhost:8084${profile.avatar}` : "/src/assets/images/defaultProfile.jpg";

  return (
    <>
      <Box maxW="1300px" mx="auto" mt={12} p={6}>
        <Text
          lineHeight="2.5"
          textAlign="center"
          fontSize="3xl"
          fontWeight="medium"
          borderBottom="2px solid gray"
          pb={2}
          mt={4}
          ml={5}
        >
          {profile.nickname}님의 프로필
        </Text>

        {/* 프로필 정보만 먼저 */}
        <Flex maxW="3xl" mx="auto" mt={12} mb={8} align="center" justify="center">
          <Avatar border="1px solid gray" boxSize="10rem" src={avatarUrl} />
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
            {profile.socialType && (
              <HStack>
                <Icon as={FaGlobe} />
                <Text fontWeight="bold" w="80px">
                  소셜
                </Text>
                <Text>{profile.socialType}</Text>
              </HStack>
            )}
          </VStack>
        </Flex>
        {/* 좋아요 앨범(아래로 쭉 내려가게) */}
        <Box mt={12}>
          <Flex height="100vh">
            {/* 왼쪽 영역 */}
            <Box flex="1" p={8}>
              <PublicProfileLikedAlbums />
            </Box>
            {/* 오른쪽 영역 */}
            <Box
              flex="1"
              p={8}
              // borderLeft="1px solid #e2e8f0"
            >
              <PublicProfilePostsTable />
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default PublicProfile;
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Box, Avatar, Text, VStack, HStack, Flex, Spinner, Center, Icon } from "@chakra-ui/react";
// import axios from "axios";
// import { FaUser, FaUserTag, FaGlobe } from "react-icons/fa";
// import PublicProfilePostsTable from "../../components/memberComponents/PublicProfilePostsTable";
// import PublicProfileLikedAlbums from "../../components/memberComponents/PublicProfileLikedAlbums";

// const PublicProfile = () => {
//   const { id } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`/api/users/${id}/profile`)
//       .then((res) => setProfile(res.data))
//       .catch((err) => console.error("유저 정보 불러오기 실패", err))
//       .finally(() => setLoading(false));
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
//     <>
//       <Box maxW="1300px" mx="auto" mt={12} p={6}>
//         <Text
//           lineHeight="2.5"
//           textAlign="center"
//           fontSize="3xl"
//           fontWeight="medium"
//           borderBottom="2px solid gray"
//           pb={2}
//           mt={4}
//           ml={5}
//         >
//           {profile.nickname}님의 프로필
//         </Text>

//         {/* 프로필 정보만 먼저 */}
//         <Flex maxW="3xl" mx="auto" mt={12} mb={8} align="center" justify="center">
//           <Avatar boxSize="10rem" src={avatarUrl} />
//           <VStack align="start" spacing={5} ml={10}>
//             <HStack>
//               <Icon as={FaUser} />
//               <Text fontWeight="bold" w="80px">
//                 닉네임
//               </Text>
//               <Text h="32px" lineHeight="32px">
//                 {profile.nickname}
//               </Text>
//             </HStack>
//             <HStack>
//               <Icon as={FaUserTag} />
//               <Text fontWeight="bold" w="80px">
//                 등급
//               </Text>
//               <Text>{profile.roleName}</Text>
//             </HStack>
//             {profile.socialType && (
//               <HStack>
//                 <Icon as={FaGlobe} />
//                 <Text fontWeight="bold" w="80px">
//                   소셜
//                 </Text>
//                 <Text>{profile.socialType}</Text>
//               </HStack>
//             )}
//           </VStack>
//         </Flex>
//         {/* 좋아요 앨범(아래로 쭉 내려가게) */}
//         <Box mt={12}>
//           <PublicProfileLikedAlbums />
//           <PublicProfilePostsTable />
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default PublicProfile;
