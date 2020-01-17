import React from "react";
import styled from "styled-components/macro";
import TableRow from "./TableRow";
import TableDataItem from "./TableDataItem";
import EnvironmentItem from "./EnvironmentItem";
import Colors from "../consts/Colors";

const ServiceWrapper = styled.div`
  padding: 0.2rem;
  margin: 0.5rem 0.5rem 0.2rem;
  border-bottom: ${Colors.darkGrey} 1px solid;
  flex: 1;
  min-width: 20%;
`;

const ServiceTitleRow = styled(TableRow)`
  margin-bottom: 0.1rem;
`;

const ServiceTitle = styled.span`
  font-weight: bold;
  font-size: 1.5rem;
`;

const PageTypeTitle = styled.span`
  font-weight: bold;
`;

const capitaliseFirstLetter = string => {
  const splitString = string.split("");
  splitString[0] = splitString[0].toUpperCase();
  return splitString.join("");
};

const Service = ({ serviceName, pageTypes }) => {
  return (
    <ServiceWrapper>
      <ServiceTitleRow>
        <TableDataItem>
          <ServiceTitle>{capitaliseFirstLetter(serviceName)}</ServiceTitle>
        </TableDataItem>
      </ServiceTitleRow>
      {pageTypes.map(page => {
        return (
          <TableRow>
            <TableDataItem>
              <PageTypeTitle>{page.type}</PageTypeTitle>
            </TableDataItem>
            {page.environments.map(environment => {
              return (
                <TableDataItem>
                  <EnvironmentItem
                    env={environment.env}
                    renderer={environment.renderer}
                    path={environment.path}
                  />
                </TableDataItem>
              );
            })}
          </TableRow>
        );
      })}
    </ServiceWrapper>
  );
};

export default Service;
