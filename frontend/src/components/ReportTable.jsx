import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const ReportTable = () => {
  return (
    <TableContainer>
      <Table
        variant="simple"
        size="md"
        sx={{
          "th, td": {
            borderBottom: "1px solid",
            borderColor: "gray.300",
            textAlign: "center",
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
          <Tr bg="pink.50">
            <Td>1</Td>
            <Td>
              <ChakraLink as={RouterLink} to="/report-details">
                test
              </ChakraLink>
            </Td>
            <Td>author</Td>
            <Td>date</Td>
          </Tr>
          <Tr bg="pink.50">
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

export default ReportTable;
