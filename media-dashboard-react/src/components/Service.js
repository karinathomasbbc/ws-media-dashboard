import React from "react";
import styled from "styled-components";
import ServiceStatus from "./ServiceStatus";

const ServiceWrapper = styled.div``;

const Service = ({ title, pageTypes }) => {
  return (
    <ServiceWrapper>
      <span>{title}</span>
    </ServiceWrapper>
  );
};

export default Service;
