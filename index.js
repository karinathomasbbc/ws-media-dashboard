const PASS = '<span title="All Checks OK">&#9989;</span>';
const FAIL = (message = "") => `<span title="${message}">&#10060;</span>`;

const getSimorghPageStatus = (id, platform = "Canonical") => {
  return isSimorghPage(id)
    ? ""
    : `Error - ${platform} Page is not rendered by Simorgh`;
};

const getPALPageStatus = id => {
  return isPALPage(id) ? "" : "Error - Page is not rendered by PAL";
};

const getElementId = (service, env, pageType, suffix) => {
  const { variant } = service;
  const variantPrefix = variant ? `/${variant}` : "";

  const elementId = `${service.service}${variantPrefix}_${env}_${pageType}_${suffix}`;
  return elementId;
};

const getMediaStatus = async (outerHTML, platform = "Canonical") => {
  const mediaPage = new DOMParser().parseFromString(outerHTML, "text/html");
  const selector = platform === "Canonical" ? "iframe" : "amp-iframe";
  const mediaPlayerContainer = mediaPage.querySelector(selector);
  let mediaHTML = null;

  if (mediaPlayerContainer !== null) {
    const embedURL = mediaPlayerContainer.getAttribute("src");
    mediaHTML = await makeRequest(embedURL).then(result => {
      return result;
    });
  }

  return mediaHTML === null ? `Error - ${platform} media not available` : "";
};

const setStatus = async (service, pageType, environment) => {
  const { env, path, renderer } = environment;
  const { type, category } = pageType;
  const elementId = getElementId(service, env, type, "status");
  const canonicalUrl = getUrl(service.service, env, path);

  const element = document.getElementById(elementId);

  if (element) {
    const validRenderers = ["Simorgh", "PAL"];
    const canonicalHTML = await makeRequest(canonicalUrl);
    let canonicalPageStatus = "";
    let canonicalMediaStatus = "";
    let ampPageStatus = "";
    let ampMediaStatus = "";

    if (validRenderers.includes(renderer)) {
      if (renderer === "Simorgh") {
        canonicalPageStatus = getSimorghPageStatus(parseId(canonicalHTML));
        const ampHTML = await makeRequest(canonicalUrl + ".amp");
        ampPageStatus = getSimorghPageStatus(parseId(ampHTML), "AMP");

        if (category === "media") {
          canonicalMediaStatus = await getMediaStatus(canonicalHTML);
          ampMediaStatus = await getMediaStatus(ampHTML, "AMP");
        }
      } else {
        canonicalPageStatus = getPALPageStatus(parseId(canonicalHTML));
      }
    }

    let results = [
      canonicalPageStatus,
      canonicalMediaStatus,
      ampPageStatus,
      ampMediaStatus
    ];

    const errorMessage = results.filter(result => result !== "").join(",");
    element.innerHTML =
      errorMessage.indexOf("Error") >= 0 ? FAIL(errorMessage) : PASS;
  }
};

const setRenderer = (service, pageType, environment) => {
  const { env, path, renderer } = environment;

  if (renderer !== "") {
    const elementId = getElementId(service, env, pageType, "renderer");
    const url = getUrl(service.service, env, path);
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<a target="_blank" href="${url}">${renderer
        .substring(0, 3)
        .toUpperCase()}</a>`;
    }
  }
};

const setPageType = (service, pageType) => {
  const { variant } = service;

  const variantPrefix = variant ? `/${variant}` : "";

  const elementId = `${service.service}${variantPrefix}_${pageType}`;
  const element = document.getElementById(elementId);

  if (element) {
    element.innerHTML = pageType;
  }
};

const handleResponse = response => {
  let text = null;

  try {
    if (response.ok) {
      text = response.text();
    } else {
      console.error(response);
    }
  } catch (e) {
    console.error(e);
  }

  return text;
};

const parseId = html => {
  let id = null;
  if (html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    id = doc.documentElement.id;
  }
  return id;
};

const makeRequest = url => {
  const prefix = "https://ws-dashboard-cors.herokuapp.com/";
  return fetch(`${prefix}${url}`)
    .then(handleResponse)
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log(error);
      return null;
    });
};

const getUrl = (service, environment, path) => {
  const serv = service.split("/")[0];
  let env = environment.split("_")[0];
  env = env === "live" ? "" : `${env}.`;

  let url = `https://www.${env}bbc.com/${service}`;

  if (path != "") {
    url += `/${path}`;
  }

  return url;
};

const isSimorghPage = id => {
  return id === "";
};

const isPALPage = id => {
  return id === "responsive-news";
};

const services = [
  {
    service: "afaanoromoo",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_afaanoromoo_radio/liveradio"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_afaanoromoo_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23149891"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "oduu-51044232"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c4g19kgl85ko"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/ce3nlgrelv1o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "afrique",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_afrique_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_afrique_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "monde-49500638"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "region-51111406"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cz216x22106o"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cx80n852v6mo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "sports-23240647"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "region-50925908"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "amharic",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_amharic_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_amharic_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "news-23263266"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "51030416"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/czqverekrldo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c0lgxqknqkdo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23194496"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "news-51338935"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "arabic",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_arabic_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_arabic_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "media-49580542"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "media-51123379"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c1er5mjnznzo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c8j91j2ljppo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "magazine-23209227"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "middleeast-51628639"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "azeri",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "azerbaijan-23257464"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "region-51069170"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c5k08pqnzexo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cv0lm08kngmo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23160428"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "other-news-48053955"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "bengali",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_bangla_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_bangla_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23269006"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "news-51095390"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c6p3yp5zzmeo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cv90149zq1eo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23215236"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "news-51780894"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "burmese",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_burmese_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_burmese_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23269011"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "media-51097769"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cn0exdy1jzvo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c41px3vd4nxo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "burma-23129848"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "world-49924127"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "cymrufyw",
    isWorldService: false,
    pageTypes: [
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "erthyglau/c06p32z9x2mo"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "erthyglau/c06p32z9x2mo"
          }
        ]
      }
    ]
  },
  {
    service: "gahuza",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_gahuza_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_gahuza_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "amakuru-23257470"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "amakuru-51108248"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cey23zx8wx8o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cryd02nzn81o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23111981"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "amakuru-47709005"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "gujarati",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "other-news-23130286"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "media-51276427"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cr5el5kw591o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c2rnxj48elwo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "hausa",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_hausa_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_hausa_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23269030"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "labarai-51100239"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c2nr6xqmnewo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c41rj1z261zo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "hindi",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_hindi_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_hindi_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "media-51106346"
          },

          {
            env: "live",
            renderer: "PAL",
            path: "media-51106346"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c0469479x9xo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cd80y3ezl8go"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "international-23095177"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "sport-51792678"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "igbo",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23182843"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "afirika-51107146"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cr1lw620ygjo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/ckjn8jnrn75o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },

          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },

          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "indonesia",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_indonesian_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_indonesian_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23269037"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "media-51102836"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c0q2zq8pzvzo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cvd36dly8zdo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "majalah-23145828"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "indonesia-49698843"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "japanese",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "video-51291089"
          },

          {
            env: "live",
            renderer: "PAL",
            path: "video-51103346"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cdd6p3r9g7jo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cj4m7n5nrd8o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "korean",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_korean_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_korean_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23248686"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "international-51367672"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c3mn1lvz65xo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/crym1243d97o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "kyrgyz",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_kyrgyz_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_kyrgyz_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23257484"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "entertainment-51113261"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c3xd4xg3rm9o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c414v42gy75o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23103385"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "entertainment-50219625"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "marathi",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23127353"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "media-51349174"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cp47g4myxz7o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cvjxwvn04yjo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "mundo",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "noticias-49546078"
          },

          {
            env: "live",
            renderer: "PAL",
            path: "noticias-51099029"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/ce42wzqr2mko"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cdwrpl7qwqqo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "naidheachdan",
    isWorldService: false,
    pageTypes: [
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "sgeulachdan/c18q7nedn2ko"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "sgeulachdan/c18q7nedn2ko"
          }
        ]
      }
    ]
  },
  {
    service: "nepali",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_nepali_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_nepali_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23269034"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "news-51096149"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cl90j9m3mn6o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c16ljg1v008o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "news-23093383"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "news-51176664"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "news",
    isWorldService: false,
    pageTypes: [
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cn7k01xp8kxo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cj7xrxz0e8zo"
          }
        ]
      }
    ]
  },
  {
    service: "pashto",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_pashto_radio/liveradio"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_pashto_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23257523"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "afghanistan-51095893"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cyjmdl92z3ro"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c70970g2251o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23092924"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "afghanistan-51576308"
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "persian",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_persian_radio/liveradio"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_persian_radio/liveradio"
          },

          {
            env: "test_dari",
            renderer: "Simorgh",
            path: "bbc_dari_radio/liveradio"
          },

          {
            env: "stage_dari",
            renderer: "Simorgh",
            path: "bbc_dari_radio/liveradio"
          },

          {
            env: "live_dari",
            renderer: "Simorgh",
            path: "bbc_dari_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "iran-23231114"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "iran-51114595"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cej3lzd5e0go"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c7eel0lmr4do"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "pidgin",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23248703"
          },

          {
            env: "live",
            renderer: "Simorgh",
            path: "tori-51096699"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cwl08rd38l6o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cgwk9w4zlg8o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "portuguese",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "geral-49602758"
          },

          {
            env: "live",
            renderer: "PAL",
            path: "geral-51092067"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cd61pm8gzmpo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cpg5prg95lmo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "punjabi",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23248705"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "india-51325361"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c0l79lr39qyo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c39p51156lyo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "russian",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "media-49281069"
          },

          {
            env: "live",
            renderer: "PAL",
            path: "media-49281069"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "scotland",
    isWorldService: false,
    pageTypes: [
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/czwj5l0n210o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cm49v4x1r9lo"
          }
        ]
      }
    ]
  },
  {
    service: "serbian",
    variant: "cyr",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "cyr/svet-51052616"
          },

          {
            env: "live",
            renderer: "PAL",
            path: "cyr/svet-51052616"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "cyr"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "cyr"
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "articles/c805k05kr73o/cyr"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c805k05kr73o/cyr"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "serbian",
    variant: "lat",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "lat/svet-51096369"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "lat/svet-51096369"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "lat"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "lat"
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "articles/c805k05kr73o/lat"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c805k05kr73o/lat"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "sinhala",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_sinhala_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_sinhala_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "world-23257567"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "sri-lanka-51037588"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c45w255zlexo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cldr38jnwd2o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "somali",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_somali_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_somali_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "hayadeed-23269042"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "51050628"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cgn6emk3jm8o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c8z79d4mzrlo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "swahili",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_swahili_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_swahili_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23268999"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "51106402"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/czjqge2jwn2o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cw794z3gpd5o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "tamil",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_tamil_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_tamil_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "india-23268994"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "global-51099200"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cwl08ll3me8o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cvr4752gr13o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "telugu",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "international-23263261"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "india-51309092"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cq0y4008d4vo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c1x76pey3x3o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "thai",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "thailand-23248713"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "international-51285795"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c442rl3md0eo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/czx7w3zyme1o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "tigrinya",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_tigrinya_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_tigrinya_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "news-23263262"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "news-51249937"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/ck62z3rjwdeo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c3vq38ve33xo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "turkce",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23268997"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "haberler-dunya-51110866"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c8q1ze59n25o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cpgzpzjl3pdo"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "ukchina",
    variant: "simp",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "simp/51085214"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "simp/51085214"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "simp"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "simp"
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/simp"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/simp"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "ukchina",
    variant: "trad",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "trad/51085214"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "trad/51085214"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "trad"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "trad"
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/trad"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/trad"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "ukrainian",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "learningenglish-51110076"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "learningenglish-51110076"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cp4l2mrejvdo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c8zv0eed9gko"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "urdu",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_urdu_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_urdu_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "world-23268929"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "pakistan-49644768"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/cwgq7rzv172o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c4qg7qq63y6o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "uzbek",
    isWorldService: true,
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "bbc_uzbek_radio/liveradio"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "bbc_uzbek_radio/liveradio"
          }
        ]
      },
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "media-50461363"
          },

          {
            env: "live",
            renderer: "PAL",
            path: "media-50461363"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "articles/cxj3rjxm6r0o"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/cxj3rjxm6r0o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "vietnamese",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "media-23257614"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "media-49614583"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/c3y59g5zm19o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cpgqngyexq7o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "yoruba",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "23183994"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "media-42985961"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: ""
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: ""
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "Simorgh",
            path: "articles/clw06m0nj8qo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cg7qz71en35o"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "zhongwen",
    variant: "simp",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "simp/chinese-news-51088031"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "simp/chinese-news-51088031"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "simp"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "simp"
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/simp"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/simp"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  },
  {
    service: "zhongwen",
    variant: "trad",
    isWorldService: true,
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "trad/chinese-news-51088031"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "trad/chinese-news-51088031"
          }
        ]
      },
      {
        type: "home",
        category: "home",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "trad"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "trad"
          }
        ]
      },
      {
        type: "article",
        category: "article",
        environments: [
          {
            env: "test",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/trad"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/trad"
          }
        ]
      },
      {
        type: "STY",
        category: "story",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "PGL",
        category: "photos",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODR",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      },
      {
        type: "ODT",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: ""
          },
          {
            env: "live",
            renderer: "PAL",
            path: ""
          }
        ]
      }
    ]
  }
];

const checkAllPages = async () => {
  const params = location.search
    .slice(1)
    .split("&")
    .map(p => p.split("="))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

  try {
    let allServices = services;

    if (params.service) {
      allServices = services.filter(
        serviceConfig => serviceConfig.service === params.service
      );
    }

    if (params.worldService) {
      allServices = allServices.filter(
        serviceConfig => serviceConfig.isWorldService === params.worldService
      );
    }

    allServices.forEach(service => {
      let allPageTypes = service.pageTypes;

      if (params.pageType) {
        allPageTypes = service.pageTypes.filter(
          pageTypeConfig => pageTypeConfig.type === params.pageType
        );
      }

      if (params.category) {
        allPageTypes = allPageTypes.filter(
          pageTypeConfig => pageTypeConfig.category === params.category
        );
      }

      allPageTypes.forEach(pageType => {
        let allEnvironments = pageType.environments;

        if (params.env) {
          allEnvironments = pageType.environments.filter(environmentConfig =>
            environmentConfig.env.startsWith(params.env)
          );
        }

        if (params.renderer) {
          allEnvironments = allEnvironments.filter(
            environmentConfig => environmentConfig.renderer === params.renderer
          );
        }

        allEnvironments.forEach(environment => {
          const page = pageType.type;

          if (environment.renderer !== "") {
            setPageType(service, page);
            setStatus(service, pageType, environment);
            setRenderer(service, page, environment);
          }
        });
      });
    });
  } catch (e) {
    //Nothing for the moment
  }
};

const getProgress = (numerator, denominator) => {
  const value = getPercentage(numerator, denominator);
  return `<pre>${numerator} / ${denominator}</pre><progress min="0" max="100" value="${value}"></progress><pre>${value}%</pre>`;
};

const getPercentage = (numerator, denominator) => {
  let percentage = 0;

  if (denominator > 0) {
    percentage = numerator / denominator;
  }

  return Math.round(percentage * 100);
};

const getWorldServiceStats = () => {
  let liveRadioServices = 0;
  let homePageServices = 0;
  let mapPageServices = 0;
  let articlePageServices = 0;
  let storyPageServices = 0;
  let photoPageServices = 0;
  let onDemandRadioPageServices = 0;
  let onDemandTVPageServices = 0;

  let simorghLiveRadio = 0;
  let simorghHomePage = 0;
  let simorghMapPage = 0;
  let simorghArticlePage = 0;
  let simorghStoryPage = 0;
  let simorghPhotoPage = 0;
  let simorghOnDemandRadioPage = 0;
  let simorghOnDemandTVPage = 0;

  const distinctServices = [];
  const map = new Map();
  services.forEach(service => {
    if (service.isWorldService && !map.has(service.service)) {
      map.set(service.service, true);
      distinctServices.push(service);
    }
  });

  distinctServices.forEach(service => {
    service.pageTypes.forEach(pageType => {
      switch (pageType.type) {
        case "liveRadio":
          liveRadioServices++;
          break;
        case "home":
          homePageServices++;
          break;
        case "MAP":
          mapPageServices++;
          break;
        case "article":
          articlePageServices++;
          break;
        case "STY":
          storyPageServices++;
          break;
        case "PGL":
          photoPageServices++;
          break;
        case "ODR":
          onDemandRadioPageServices++;
          break;
        case "ODT":
          onDemandTVPageServices++;
          break;
      }

      pageType.environments.forEach(environment => {
        if (environment.env === "live" && environment.renderer === "Simorgh") {
          switch (pageType.type) {
            case "liveRadio":
              simorghLiveRadio++;
              break;
            case "home":
              simorghHomePage++;
              break;
            case "MAP":
              simorghMapPage++;
              break;
            case "article":
              simorghArticlePage++;
              break;
            case "STY":
              simorghStoryPage++;
              break;
            case "PGL":
              simorghPhotoPage++;
              break;
            case "ODR":
              simorghOnDemandRadioPage++;
              break;
            case "ODT":
              simorghOnDemandTVPage++;
              break;
          }
        }
      });
    });
  });

  document.getElementById("Simorgh_W2020_liveRadio").innerHTML = getProgress(
    simorghLiveRadio,
    liveRadioServices
  );

  document.getElementById("Simorgh_W2020_MAP").innerHTML = getProgress(
    simorghMapPage,
    mapPageServices
  );

  document.getElementById("Simorgh_W2020_home").innerHTML = getProgress(
    simorghHomePage,
    homePageServices
  );

  document.getElementById("Simorgh_W2020_article").innerHTML = getProgress(
    simorghArticlePage,
    articlePageServices
  );

  document.getElementById("Simorgh_W2020_story").innerHTML = getProgress(
    simorghStoryPage,
    storyPageServices
  );

  document.getElementById("Simorgh_W2020_photos").innerHTML = getProgress(
    simorghPhotoPage,
    photoPageServices
  );

  document.getElementById(
    "Simorgh_W2020_onDemandRadio"
  ).innerHTML = getProgress(
    simorghOnDemandRadioPage,
    onDemandRadioPageServices
  );

  document.getElementById("Simorgh_W2020_onDemandTV").innerHTML = getProgress(
    simorghOnDemandTVPage,
    onDemandTVPageServices
  );
};

const getPublicServiceStats = () => {
  let articlePageServices = 0;
  let simorghArticlePage = 0;

  const distinctServices = [];
  const map = new Map();
  services.forEach(service => {
    if (!service.isWorldService && !map.has(service.service)) {
      map.set(service.service, true);
      distinctServices.push(service);
    }
  });

  distinctServices.forEach(service => {
    service.pageTypes.forEach(pageType => {
      switch (pageType.type) {
        case "article":
          articlePageServices++;
          break;
      }

      pageType.environments.forEach(environment => {
        if (environment.env === "live" && environment.renderer === "Simorgh") {
          switch (pageType.type) {
            case "article":
              simorghArticlePage++;
              break;
          }
        }
      });
    });
  });

  document.getElementById("Simorgh_article").innerHTML = getProgress(
    simorghArticlePage,
    articlePageServices
  );
};

const loadData = async () => {
  getWorldServiceStats();
  getPublicServiceStats();
  checkAllPages();
};
