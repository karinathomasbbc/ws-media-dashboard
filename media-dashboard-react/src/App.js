import React from "react";
import styled from "styled-components";
import services from "./consts/services";
import Service from "./components/Service";
import TableHeading from "./components/TableHeading";
import TableRow from "./components/TableRow";

const AppWrapper = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const DataTable = styled.table``;

const App = () => {
  return (
    <AppWrapper>
      <DataTable>
        <TableRow>
          <TableHeading />
        </TableRow>
        {services.map(service => {
          return (
            <Service
              serviceName={service.service}
              pageTypes={service.pageTypes}
            ></Service>
          );
        })}
      </DataTable>
    </AppWrapper>
  );
};

export default App;
