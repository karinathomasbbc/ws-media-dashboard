import React from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div``;

const EnvironmentItem = ({ renderer }) => {
  return <Wrapper>{renderer}</Wrapper>;
};

export default EnvironmentItem;
