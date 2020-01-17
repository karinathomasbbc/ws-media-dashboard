import React from "react";
import styled from "styled-components";

const TableHeadingRow = styled.tr``;

const TableHeadingItem = styled.th`
  min-width: 100px;
`;

const TableHeading = () => {
  return (
    <TableHeadingRow>
      <TableHeadingItem> </TableHeadingItem>
      <TableHeadingItem>Test</TableHeadingItem>
      <TableHeadingItem>Stage</TableHeadingItem>
      <TableHeadingItem>Live</TableHeadingItem>
    </TableHeadingRow>
  );
};

export default TableHeading;
