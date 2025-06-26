import { Box, Text, Heading, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNotice = async () => {
      try {
        const res = await axios.get(`/api/notices/${id}`);
        setNotice(res.data);
      } catch (err) {
        console.error("공지사항 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (loading) return <Spinner size="lg" />;
  if (!notice) return <Text>해당 공지사항을 찾을 수 없습니다.</Text>;

  return (
    <Box maxW="800px" mx="auto" px={4} py={8}>
      <Heading as="h1" mb={4}>
        {notice.title}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={2}>
        작성일: {notice.createdAt?.split("T")[0] ?? "알 수 없음"}
      </Text>
      <Text fontSize="md" whiteSpace="pre-wrap">
        {notice.content}
      </Text>
    </Box>
  );
};

export default NoticeDetail;
