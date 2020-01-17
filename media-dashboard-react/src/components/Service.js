import React from "react";
import styled from "styled-components/macro";
import TableRow from "./TableRow";
import TableDataItem from "./TableDataItem";
import EnvironmentItem from "./EnvironmentItem";
import Colors from "../consts/Colors";

const ServiceWrapper = styled.div`
  padding: 0.3rem;
  margin: 0.5rem 0.5rem 0.3rem;
  border-bottom: ${Colors.darkGrey} 1px solid;
  flex: 1;
  min-width: 15%;
`;

const ServiceTitleRow = styled(TableRow)`
  margin-bottom: 0.1rem;
`;

const ServiceTitle = styled.span`
  font-weight: bold;
  font-size: 1.5rem;
  font-family: "Roboto", sans-serif;
`;

const PageTypeTitle = styled.span`
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
`;

const PageTypeTitleDataItem = styled(TableDataItem)`
  flex: 1.5;
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
            <PageTypeTitleDataItem>
              <PageTypeTitle>{page.type}</PageTypeTitle>
            </PageTypeTitleDataItem>
            {page.environments.map(environment => {
              return (
                <TableDataItem>
                  <EnvironmentItem renderer={environment.renderer} />
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
