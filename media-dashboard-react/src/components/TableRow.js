import React from "react";
import styled from "styled-components/macro";

const TableRow = styled.div`
  display: flex;
  max-width: 33%;
`;

const TableRowComponent = ({ children, className }) => {
  return <TableRow className={className}>{children}</TableRow>;
};

export default TableRowComponent;
