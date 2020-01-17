import React from "react";
import styled from "styled-components/macro";
import Service from "./Service";
import TableHeading from "./TableHeading";
import TableRow from "./TableRow";

const DataTable = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
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
