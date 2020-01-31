import React, { useEffect } from "react";
import styled from "styled-components/macro";
import makeRequest from "../helpers/MakeRequest";

const Wrapper = styled.div``;

const EnvironmentText = styled.span`
  font-family: "Open Sans", sans-serif;
`;

const EnvironmentItem = ({ environment, serviceName }) => {
  const { env, path, renderer } = environment;

  useEffect(() => {
    let queryUrl = getUrl(serviceName, env, path);
    getEnvironmentStatus(queryUrl);
  }, []);

  const getUrl = (serviceName, env, path) => {
    env = env === "live" ? "" : `${env}.`;
    return `https://www.${env}bbc.com/${serviceName}/${path}`;
  };

  const getEnvironmentStatus = async path => {
    let data = await makeRequest(path);
  };

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
