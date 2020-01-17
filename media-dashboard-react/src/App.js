import React from "react";
import styled from "styled-components";
import services from "./consts/services";
import Table from "./components/Table";

const AppWrapper = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  width: 100%;
  display: flex;
  color: white;
`;

const TableWrapper = styled.div`
  padding: 1rem;
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
