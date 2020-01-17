import React from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div``;

const EnvironmentText = styled.span`
  font-family: "Open Sans", sans-serif;
`;

const EnvironmentItem = ({ renderer }) => {
  const handleEnvItemText = text => {
    if (text.toLowerCase() === "simorgh") {
      return "Si";
    } else {
      return text;
    }
  };

  return (
    <Wrapper>
      <EnvironmentText>{handleEnvItemText(renderer)}</EnvironmentText>
    </Wrapper>
  );
};

export default EnvironmentItem;
