import React from "react";
import styled from "styled-components";
import Service from "./Service";
import TableHeading from "./TableHeading";
import TableRow from "./TableRow";

const DataTable = styled.table`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(8, auto);
`;

const Table = ({ services }) => {
  return (
    <DataTable>
      <TableRow>
        <TableHeading />
      </TableRow>
      {services.map(service => {
        return (
          <Service
            serviceName={service.service}
            pageTypes={service.pageTypes}
          />
        );
      })}
    </DataTable>
  );
};

export default Table;
