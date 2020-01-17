import React from "react";
import styled from "styled-components";
import TableRow from "./TableRow";
import TableDataItem from "./TableDataItem";
import EnvironmentItem from "./EnvironmentItem";

const ServiceWrapper = styled.div``;

const Service = ({ serviceName, pageTypes }) => {
  debugger;
  return (
    <ServiceWrapper>
      <TableRow>
        <TableDataItem>{serviceName}</TableDataItem>
      </TableRow>
      {pageTypes.map(page => {
        return (
          <TableRow>
            <TableDataItem>{page.type}</TableDataItem>
            {page.environments.map(environment => {
              return (
                <EnvironmentItem
                  env={environment.env}
                  renderer={environment.renderer}
                  path={environment.path}
                />
              );
            })}
          </TableRow>
        );
      })}
    </ServiceWrapper>
  );
};

export default Service;
