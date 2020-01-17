import React from "react";
import styled from "styled-components/macro";
import services from "./consts/services";
import Table from "./components/Table";
import Colors from "./consts/Colors";
import "./consts/Typography.css";

const AppWrapper = styled.div`
  background-color: ${Colors.backgroundGrey};
  display: flex;
  flex-direction: column;
`;

const TableWrapper = styled.div`
  margin: 2rem;
  border-radius: 4px;
  background-color: ${Colors.white};
`;

const App = () => {
  return (
    <AppWrapper>
      <TableWrapper>
        <Table services={services} />
      </TableWrapper>
    </AppWrapper>
  );
};

export default App;
