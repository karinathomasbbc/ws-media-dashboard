import React, { useState, useEffect } from "react";
import styled from "styled-components";
import services from "./consts/services";
import Service from "./components/Service";

const AppWrapper = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const App = () => {
  //   const PASS = "&#9989;";
  //   const FAIL = "&#10060;";

  //   const PAGE_PASS = `<span title="Page OK">${PASS}</span>`;
  //   const PAGE_FAIL = `<span title="Page Error">${FAIL}</span>`;

  //   const MEDIA_PASS = `<span title="Media OK">${PASS}</span>`;
  //   const MEDIA_FAIL = `<span title="Media Error">${FAIL}</span>`;

  //   const getSimorghPageStatus = id => {
  //     return isSimorghPage(id) ? PAGE_PASS : PAGE_FAIL;
  //   };

  //   const getPALPageStatus = id => {
  //     return isPALPage(id) ? PAGE_PASS : PAGE_FAIL;
  //   };

  //   const getElementId = (service, env, pageType, suffix) => {
  //     const elementId = `${service}_${env}_${pageType}_${suffix}`;
  //     return elementId;
  //   };

  //   const getMediaStatus = async outerHTML => {
  //     let mediaStatus = "";
  //     const mediaPage = new DOMParser().parseFromString(outerHTML, "text/html");
  //     const mediaPlayerContainer = mediaPage.querySelector("iframe");

  //     if (mediaPlayerContainer !== null) {
  //       const embedURL = mediaPlayerContainer.src;
  //       const mediaHTML = await makeRequest(embedURL).then(result => {
  //         return result;
  //       });
  //       mediaStatus = mediaHTML !== null ? MEDIA_PASS : MEDIA_FAIL;
  //     }

  //     return mediaStatus;
  //   };

  //   const setStatus = async (service, pageType, environment) => {
  //     const { env, path, renderer } = environment;
  //     const { type, category } = pageType;
  //     const elementId = getElementId(service, env, type, "status");
  //     const url = getUrl(service, env, path);

  //     const element = document.getElementById(elementId);

  //     if (element) {
  //       const pageHTML = await makeRequest(url);
  //       let pageStatus = "";
  //       let mediaStatus = "";

  //       if (renderer === "Simorgh" || renderer === "PAL") {
  //         pageStatus =
  //           renderer === "Simorgh"
  //             ? getSimorghPageStatus(parseId(pageHTML))
  //             : getPALPageStatus(parseId(pageHTML));

  //         if (category === "media") {
  //           mediaStatus = await getMediaStatus(pageHTML);
  //         }
  //       }

  //       element.innerHTML = pageStatus + mediaStatus;
  //     }
  //   };

  //   const setRenderer = (service, pageType, environment) => {
  //     const { env, path, renderer } = environment;

  //     if (renderer !== "") {
  //       const elementId = getElementId(service, env, pageType, "renderer");
  //       const url = getUrl(service, env, path);
  //       const element = document.getElementById(elementId);
  //       if (element) {
  //         element.innerHTML = `<a target="_blank" href="${url}">${renderer
  //           .substring(0, 3)
  //           .toUpperCase()}</a>`;
  //       }
  //     }
  //   };

  //   const setPageType = (service, pageType) => {
  //     const elementId = `${service}_${pageType}`;
  //     const element = document.getElementById(elementId);

  //     if (element) {
  //       element.innerHTML = pageType;
  //     }
  //   };

  //   const handleResponse = response => {
  //     let text = null;

  //     try {
  //       if (response.ok) {
  //         text = response.text();
  //       }
  //     } catch (e) {
  //       console.log("ERROR", e);
  //     }

  //     return text;
  //   };

  //   const parseId = html => {
  //     let id = null;
  //     if (html) {
  //       var doc = new DOMParser().parseFromString(html, "text/html");
  //       id = doc.documentElement.id;
  //     }
  //     return id;
  //   };

  //   const makeRequest = url => {
  //     const prefix = "https://ws-media-cors.herokuapp.com/";
  //     return fetch(`${prefix}${url}`)
  //       .then(handleResponse)
  //       .then(data => {
  //         return data;
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         return null;
  //       });
  //   };

  //   const getUrl = (service, environment, path) => {
  //     const serv = service.split("/")[0];
  //     let env = environment.split("_")[0];
  //     env = env === "live" ? "" : `${env}.`;
  //     return `https://www.${env}bbc.com/${service}/${path}`;
  //   };

  //   const isSimorghPage = id => {
  //     return id === "";
  //   };

  //   const isPALPage = id => {
  //     return id === "responsive-news";
  //   };

  //   const checkAllPages = async () => {
  //     const params = window.location.search
  //       .slice(1)
  //       .split("&")
  //       .map(p => p.split("="))
  //       .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

  //     try {
  //       services.forEach(service => {
  //         service.pageTypes.forEach(pageType => {
  //           pageType.environments.forEach(environment => {
  //             const { type, category } = pageType;
  //             const { env, renderer } = environment;
  //             if (environment.renderer !== "") {
  //               let load = true;

  //               if (params && params.category) {
  //                 load =
  //                   params.category &&
  //                   params.category.toLowerCase() === category.toLowerCase();
  //                 // ||
  //                 // (params.env && params.env.toLowerCase() === env.toLowerCase())
  //               }

  //               if (load) {
  //                 setPageType(service.service, type);
  //                 setStatus(service.service, pageType, environment);
  //                 setRenderer(service.service, type, environment);
  //               }
  //             }
  //           });
  //         });
  //       });
  //     } catch (e) {
  //       //Nothing for the moment
  //     }
  //   };

  //   const loadData = async() => {
  //     checkAllPages();
  // };

  console.log(services);

  return (
    <AppWrapper>
      {services.map(service => {
        return (
          <Service
            title={service.service}
            pageTypes={service.pageTypes}
          ></Service>
        );
      })}
    </AppWrapper>
  );
};

export default App;
