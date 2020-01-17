import React from "react";
import styled from "styled-components/macro";

const StatusWrapper = styled.div``;

const Service = ({ status }) => {
  return (
    <StatusWrapper>
      <span>{status}</span>
    </StatusWrapper>
  );
};

export default Service;
