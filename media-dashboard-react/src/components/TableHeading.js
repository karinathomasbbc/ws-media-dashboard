import React from "react";
import styled from "styled-components/macro";
import TableRow from "./TableRow";

const TableHeadingItem = styled.div`
  /* min-width: 100px; */
  flex: 0.2;
`;

const TableHeadingRow = styled(TableRow)`
  padding: 0 0.8rem;
`;

const TableHeading = () => {
  return (
    <TableHeadingRow>
      <TableHeadingItem>Test</TableHeadingItem>
      <TableHeadingItem>Stage</TableHeadingItem>
      <TableHeadingItem>Live</TableHeadingItem>
    </TableHeadingRow>
  );
};

export default TableHeading;
