import React from "react";
import styled from "styled-components/macro";

const TableDataItem = styled.div`
  flex: 1;
`;

const TableDataItemComponent = ({ children, className }) => {
  return <TableDataItem className={className}>{children}</TableDataItem>;
};

export default TableDataItemComponent;
