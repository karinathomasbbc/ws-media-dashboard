import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TableRow from "./TableRow";
import TableDataItem from "./TableDataItem";

const ServiceWrapper = styled.div``;

const Service = ({ serviceName, pageTypes }) => {
  return (
    <ServiceWrapper>
      <TableRow>
        <TableDataItem>{serviceName}</TableDataItem>
      </TableRow>
    </ServiceWrapper>
  );
};

export default Service;
