import React from "react";
import styled from "styled-components/macro";
import TableRow from "./TableRow";
import Colors from "../consts/colors";

const TableKeyItem = styled.div`
  /* min-width: 100px; */
  margin-right: 1.2em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TableKeyRow = styled(TableRow)`
  padding: 0 0.8rem;
`;

const KeyText = styled.span`
  font-family: "Roboto", sans-serif;
`;

const KeyBox = styled.div`
  margin-left: 0.25rem;
  width: 18px;
  border-radius: 2px;
  height: 18px;
  background-color: ${props => props.color};
`;

const TableKey = () => {
  return (
    <TableKeyRow>
      <TableKeyItem>
        <KeyText>Test</KeyText>
        <KeyBox color={Colors.testBlue}></KeyBox>
      </TableKeyItem>
      <TableKeyItem>
        <KeyText>Stage</KeyText>
        <KeyBox color={Colors.stagingAmber}></KeyBox>
      </TableKeyItem>
      <TableKeyItem>
        <KeyText>Live</KeyText>
        <KeyBox color={Colors.livePurple}></KeyBox>
      </TableKeyItem>
    </TableKeyRow>
  );
};

export default TableKey;
