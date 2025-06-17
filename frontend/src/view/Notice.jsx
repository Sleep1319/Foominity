import React from "react";

const Notice = () => {
  return (
    <div>
      <Box p={6}>
        <Text fontSize="3xl" fontWeight="medium" borderBottom="2px solid gray" pb={2}>
          Notice📌
        </Text>
        <ReportTable />
      </Box>
    </div>
  );
};

export default Notice;
