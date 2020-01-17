import React from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const EnvironmentItem = ({ env, renderer, path }) => {
  return (
    <Wrapper>
      {env} {renderer} {path}
    </Wrapper>
  );
};

export default EnvironmentItem;
