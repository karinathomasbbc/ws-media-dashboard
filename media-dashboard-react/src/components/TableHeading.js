import React from "react";
import styled from "styled-components";

const TableHeadingRow = styled.tr``;

const TableHeadingItem = styled.th``;

const TableHeading = ({}) => {
  return (
    <TableHeadingRow>
      <TableHeadingItem>Test</TableHeadingItem>
      <TableHeadingItem>Stage</TableHeadingItem>
      <TableHeadingItem>Live</TableHeadingItem>
    </TableHeadingRow>
  );
};

export default TableHeading;
