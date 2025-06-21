import React from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";

const ReviewTable = () => {
  return (
    <TableContainer>
      <Table
        variant="simple"
        size="md"
        sx={{
          "th, td": {
            borderBottom: "1px solid",
            borderColor: "gray.300",
          },
        }}
      >
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th w="5%" textAlign="center" fontSize="md" fontWeight="medium">
              번호
            </Th>
            <Th w="65%" textAlign="center" pl={4} fontSize="md" fontWeight="medium">
              제목
            </Th>
            <Th w="15%" textAlign="center" fontSize="md" fontWeight="medium">
              글쓴이
            </Th>
            <Th w="15%" textAlign="center" fontSize="md" fontWeight="medium">
              날짜
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default ReviewTable;
