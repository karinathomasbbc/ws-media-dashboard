import React from "react";
import styled from "styled-components";

const TableDataItem = styled.td``;

const TableDataItemComponent = ({ children }) => {
  return <TableDataItem>{children}</TableDataItem>;
};

export default TableDataItemComponent;
