import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import makeRequest from "../helpers/MakeRequest";

const Wrapper = styled.div``;

const EnvironmentText = styled.span`
  font-family: "Open Sans", sans-serif;
`;

const EnvironmentItem = ({ environment, serviceName, page }) => {
  const { env, path, renderer } = environment;
  const [pageHtml, setPageHtml] = useState(null);
  const [pageStatus, setPageStatus] = useState(null);
  const [mediaStatus, setMediaStatus] = useState(null);

  useEffect(() => {
    let queryUrl = getUrl(serviceName, env, path);
    getPageHtml(queryUrl);
    if (pageHtml) {
      setEnvironmentStatus(renderer, pageHtml, page.category);
    }
  }, [pageHtml]);

  const getPageHtml = async path => {
    let data = await makeRequest(path);
    setPageHtml(data);
  };

  const getUrl = (serviceName, env, path) => {
    env = env === "live" ? "" : `${env}.`;
    return `https://www.${env}bbc.com/${serviceName}/${path}`;
  };

  const getSimorghPageStatus = id => {
    return id === "" ? true : false;
  };

  const getPALPageStatus = id => {
    return id === "responsive-news" ? true : false;
  };

  const parseId = html => {
    let id = null;
    if (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      id = doc.documentElement.id;
    }
    return id;
  };

  const getMediaStatus = async outerHTML => {
    let mediaStatus = "";
    const mediaPage = new DOMParser().parseFromString(outerHTML, "text/html");
    const mediaPlayerContainer = mediaPage.querySelector("iframe");

    if (mediaPlayerContainer !== null) {
      const embedURL = mediaPlayerContainer.src;
      const mediaHTML = await makeRequest(embedURL).then(result => {
        return result;
      });
      mediaStatus = mediaHTML !== null ? true : false;
    }

    return mediaStatus;
  };

  const setEnvironmentStatus = async (renderer, html, pageCategory) => {
    let pageStatus = "";
    let mediaStatus = "";

    if (renderer === "Simorgh" || renderer === "PAL") {
      pageStatus =
        renderer === "Simorgh"
          ? getSimorghPageStatus(parseId(html))
          : getPALPageStatus(parseId(html));

      // if (pageCategory === "media") {
      //   mediaStatus = await getMediaStatus(html);
      // }
    }

    setPageStatus(pageStatus);
    setMediaStatus(mediaStatus);
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
      <EnvironmentText>
        {handleEnvItemText(renderer)} {`${pageStatus}`}
      </EnvironmentText>
    </Wrapper>
  );
};

export default EnvironmentItem;
