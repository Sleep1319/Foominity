import React from "react";
import { Box, Text } from "@chakra-ui/react";
import AdminPageList from "../../components/adminpageComponents/AdminPageList.jsx";

const AdminPage = () => {
  return (
    <div>
      <Box p={6}>
        <Text fontSize="3xl" fontWeight="extrabold" pb={2} textAlign="center" mt="100px">
          Admin Page
        </Text>
        <AdminPageList />
      </Box>
    </div>
  );
};

export default AdminPage;
