import React from "react";
import styled from "styled-components/macro";
import Service from "./Service";
import TableKey from "./TableKey";

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
      <TableKey />
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
