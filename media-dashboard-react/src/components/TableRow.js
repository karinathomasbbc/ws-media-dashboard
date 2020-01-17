import React from "react";
import styled from "styled-components";

const TableRow = styled.tr``;

const TableRowComponent = ({ children, className }) => {
  return <TableRow className={className}>{children}</TableRow>;
};

export default TableRowComponent;
