import React from "react";
import styled from "styled-components";
import TableRow from "./TableRow";

const TableHeadingItem = styled.div`
  /* min-width: 100px; */
  flex: 1;
`;

const TableHeading = () => {
  return (
    <TableRow>
      <TableHeadingItem> </TableHeadingItem>
      <TableHeadingItem>Test</TableHeadingItem>
      <TableHeadingItem>Stage</TableHeadingItem>
      <TableHeadingItem>Live</TableHeadingItem>
    </TableRow>
  );
};

export default TableHeading;
