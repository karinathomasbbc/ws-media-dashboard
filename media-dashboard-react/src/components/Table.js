import React from "react";
import styled from "styled-components/macro";
import Service from "./Service";
import TableHeading from "./TableHeading";
import TableRow from "./TableRow";

const DataTable = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  color: black;
`;

const ServicesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Table = ({ services }) => {
  return (
    <DataTable>
      <TableHeading />
      <ServicesWrapper>
        {services.map(service => {
          return (
            <Service
              serviceName={service.service}
              pageTypes={service.pageTypes}
            />
          );
        })}
      </ServicesWrapper>
    </DataTable>
  );
};

export default Table;
