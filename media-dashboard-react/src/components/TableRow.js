import React from "react";
import styled from "styled-components";

const TableRow = styled.tr``;

const TableRowComponent = ({ children }) => {
  return <TableRow>{children}</TableRow>;
};

export default TableRowComponent;
