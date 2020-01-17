import React from "react";
import styled from "styled-components";

const TableDataItem = styled.div`
  flex: 1;
`;

const TableDataItemComponent = ({ children }) => {
  return <TableDataItem>{children}</TableDataItem>;
};

export default TableDataItemComponent;
