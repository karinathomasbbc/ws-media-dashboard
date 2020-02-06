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
  const prefix = "https://ws-media-cors.herokuapp.com/";
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
            env: "stage",
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
            renderer: "PAL",
            path: "oduu-49490954"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "oduu-49490954"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "oduu-51103116"
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c4g19kgl85ko"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/ce3nlgrelv1o"
          }
        ]
      }
    ]
  },
  {
    service: "afrique",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cz216x22106o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cx80n852v6mo"
          }
        ]
      }
    ]
  },
  {
    service: "amharic",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/czqverekrldo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c0lgxqknqkdo"
          }
        ]
      }
    ]
  },
  {
    service: "arabic",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c1er5mjnznzo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c8j91j2ljppo"
          }
        ]
      }
    ]
  },
  {
    service: "azeri",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "region-49364777"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "region-49364777"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c5k08pqnzexo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cv0lm08kngmo"
          }
        ]
      }
    ]
  },
  {
    service: "bengali",
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
            env: "stage",
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
            renderer: "PAL",
            path: "news-49579870"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "news-49579870"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c6p3yp5zzmeo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cv90149zq1eo"
          }
        ]
      }
    ]
  },
  {
    service: "burmese",
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
            env: "stage",
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
            renderer: "PAL",
            path: "media-49571787"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "media-49571787"
          },
          {
            env: "live",
            renderer: "PAL",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/cn0exdy1jzvo"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cn0exdy1jzvo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c41px3vd4nxo"
          }
        ]
      }
    ]
  },
  // {
  //   service: "cymrufyw",
  //   pageTypes: []
  // },
  {
    service: "gahuza",
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
            env: "stage",
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
            renderer: "PAL",
            path: "amakuru-49534170"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "amakuru-49534170"
          },
          {
            env: "live",
            renderer: "PAL",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/cey23zx8wx8o"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cey23zx8wx8o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cryd02nzn81o"
          }
        ]
      }
    ]
  },
  {
    service: "gujarati",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cr5el5kw591o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c2rnxj48elwo"
          }
        ]
      }
    ]
  },
  {
    service: "hausa",
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
            env: "stage",
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
            renderer: "PAL",
            path: "labarai-49513456"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "labarai-49513456"
          },
          {
            env: "live",
            renderer: "PAL",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/c2nr6xqmnewo"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c2nr6xqmnewo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c41rj1z261zo"
          }
        ]
      }
    ]
  },
  {
    service: "hindi",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c0469479x9xo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cd80y3ezl8go"
          }
        ]
      }
    ]
  },
  {
    service: "igbo",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cr1lw620ygjo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/ckjn8jnrn75o"
          }
        ]
      }
    ]
  },
  {
    service: "indonesia",
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
            env: "stage",
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
            renderer: "PAL",
            path: "media-49591990"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "media-49591990"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            path: "articles/c0q2zq8pzvzo"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c0q2zq8pzvzo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cvd36dly8zdo"
          }
        ]
      }
    ]
  },
  {
    service: "japanese",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cdd6p3r9g7jo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cj4m7n5nrd8o"
          }
        ]
      }
    ]
  },
  {
    service: "korean",
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
            env: "stage",
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
            env: "stage",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/c3mn1lvz65xo"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c3mn1lvz65xo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/crym1243d97o"
          }
        ]
      }
    ]
  },
  {
    service: "kyrgyz",
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
            env: "stage",
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
            renderer: "PAL",
            path: "sapar-tv-48695523"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "sapar-tv-48695523"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c3xd4xg3rm9o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c414v42gy75o"
          }
        ]
      }
    ]
  },
  {
    service: "marathi",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cp47g4myxz7o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cvjxwvn04yjo"
          }
        ]
      }
    ]
  },
  {
    service: "mundo",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/ce42wzqr2mko"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cdwrpl7qwqqo"
          }
        ]
      }
    ]
  },
  // {
  //   service: "naidheachdan",
  //   pageTypes: []
  // },
  {
    service: "nepali",
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
            env: "stage",
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
            renderer: "PAL",
            path: "news-49613544"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "news-49613544"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cl90j9m3mn6o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c16ljg1v008o"
          }
        ]
      }
    ]
  },
  // {
  //   service: "news",
  //   pageTypes: []
  // },
  {
    service: "pashto",
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
            env: "stage",
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
            renderer: "PAL",
            path: "afghanistan-49628873"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "afghanistan-49628873"
          },
          {
            env: "live",
            renderer: "PAL",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/cyjmdl92z3ro"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cyjmdl92z3ro"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c70970g2251o"
          }
        ]
      }
    ]
  },
  {
    service: "persian",
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
            env: "stage",
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
            renderer: "PAL",
            path: "iran-51114600"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "iran-51114600"
          },
          {
            env: "live",
            renderer: "PAL",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/cej3lzd5e0go"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cej3lzd5e0go"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c7eel0lmr4do"
          }
        ]
      }
    ]
  },
  {
    service: "pidgin",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cwl08rd38l6o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cgwk9w4zlg8o"
          }
        ]
      }
    ]
  },
  {
    service: "portuguese",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cd61pm8gzmpo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cpg5prg95lmo"
          }
        ]
      }
    ]
  },
  {
    service: "punjabi",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c0l79lr39qyo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c39p51156lyo"
          }
        ]
      }
    ]
  },
  {
    service: "russian",
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
            env: "stage",
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
            env: "stage",
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
            path: "articles/ck7pz7re3zgo"
          },
          {
            env: "stage",
            renderer: "N/A",
            path: "articles/ck7pz7re3zgo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c6ygxgl53w9o"
          }
        ]
      }
    ]
  },
  // {
  //   service: "scotland",
  //   pageTypes: []
  // },
  {
    service: "serbian",
    variant: "cyr",
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
            env: "stage",
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
            renderer: "PAL",
            path: "cyr"
          },
          {
            env: "stage",
            renderer: "PAL",
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
            env: "stage",
            renderer: "N/A",
            path: "articles/c805k05kr73o/cyr"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c805k05kr73o/cyr"
          }
        ]
      }
    ]
  },
  {
    service: "serbian",
    variant: "lat",
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
            env: "stage",
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
            renderer: "PAL",
            path: "lat"
          },
          {
            env: "stage",
            renderer: "PAL",
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
            env: "stage",
            renderer: "N/A",
            path: "articles/c805k05kr73o/lat"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c805k05kr73o/lat"
          }
        ]
      }
    ]
  },
  {
    service: "sinhala",
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
            env: "stage",
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
            renderer: "PAL",
            path: "sri-lanka-51249064"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "sri-lanka-51249064"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c45w255zlexo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cldr38jnwd2o"
          }
        ]
      }
    ]
  },
  {
    service: "somali",
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
            env: "stage",
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
            renderer: "PAL",
            path: "media-48870869"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "media-48870869"
          },
          {
            env: "live",
            renderer: "PAL",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/cgn6emk3jm8o"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cgn6emk3jm8o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c8z79d4mzrlo"
          }
        ]
      }
    ]
  },
  {
    service: "swahili",
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
            env: "stage",
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
            renderer: "PAL",
            path: "51106402"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "51106402"
          },
          {
            env: "live",
            renderer: "PAL",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/czjqge2jwn2o"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/czjqge2jwn2o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cw794z3gpd5o"
          }
        ]
      }
    ]
  },
  {
    service: "tamil",
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
            env: "stage",
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
            renderer: "PAL",
            path: "science-49626264"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "science-49626264"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cwl08ll3me8o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cvr4752gr13o"
          }
        ]
      }
    ]
  },
  {
    service: "telugu",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cq0y4008d4vo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c1x76pey3x3o"
          }
        ]
      }
    ]
  },
  {
    service: "thai",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "international-51113461"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "international-51113461"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "international-51113461"
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c442rl3md0eo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/czx7w3zyme1o"
          }
        ]
      }
    ]
  },
  {
    service: "tigrinya",
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
            env: "stage",
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
            renderer: "PAL",
            path: "news-51060789"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "news-51060789"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "news-51060789"
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/ck62z3rjwdeo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c3vq38ve33xo"
          }
        ]
      }
    ]
  },
  {
    service: "turkce",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "haberler-dunya-51110866"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "haberler-dunya-51110866"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            path: "articles/c8q1ze59n25o"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c8q1ze59n25o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cpgzpzjl3pdo"
          }
        ]
      }
    ]
  },
  {
    service: "ukchina",
    variant: "simp",
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
            env: "stage",
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
            renderer: "PAL",
            path: "simp"
          },
          {
            env: "stage",
            renderer: "PAL",
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
            env: "stage",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/simp"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/simp"
          }
        ]
      }
    ]
  },
  {
    service: "ukchina",
    variant: "trad",
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
            env: "stage",
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
            renderer: "PAL",
            path: "trad"
          },
          {
            env: "stage",
            renderer: "PAL",
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
            env: "stage",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/trad"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c0e8weny66ko/trad"
          }
        ]
      }
    ]
  },
  {
    service: "ukrainian",
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
            env: "stage",
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
            renderer: "PAL",
            path: ""
          },
          {
            env: "stage",
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
            path: "articles/cp4l2mrejvdo"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cp4l2mrejvdo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c8zv0eed9gko"
          }
        ]
      }
    ]
  },
  {
    service: "urdu",
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
            env: "stage",
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
            renderer: "PAL",
            path: "pakistan-49644768"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "pakistan-49644768"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            path: "articles/cwgq7rzv172o"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/cwgq7rzv172o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/c4qg7qq63y6o"
          }
        ]
      }
    ]
  },
  {
    service: "uzbek",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "N/A",
            path: "articles/cxj3rjxm6r0o"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/cxj3rjxm6r0o"
          }
        ]
      }
    ]
  },
  {
    service: "vietnamese",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "media-49614583"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "media-49614583"
          },
          {
            env: "live",
            renderer: "PAL",
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
            env: "stage",
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
            path: "articles/c3y59g5zm19o"
          },
          {
            env: "stage",
            renderer: "Simorgh",
            path: "articles/c3y59g5zm19o"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cpgqngyexq7o"
          }
        ]
      }
    ]
  },
  {
    service: "yoruba",
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
            env: "stage",
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
            env: "stage",
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
            env: "stage",
            renderer: "Simorgh",
            path: "articles/clw06m0nj8qo"
          },
          {
            env: "live",
            renderer: "Simorgh",
            path: "articles/cg7qz71en35o"
          }
        ]
      }
    ]
  },
  {
    service: "zhongwen",
    variant: "simp",
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
            env: "stage",
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
            renderer: "PAL",
            path: "simp"
          },
          {
            env: "stage",
            renderer: "PAL",
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
            env: "stage",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/simp"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/simp"
          }
        ]
      }
    ]
  },
  {
    service: "zhongwen",
    variant: "trad",
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
            env: "stage",
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
            renderer: "PAL",
            path: "trad"
          },
          {
            env: "stage",
            renderer: "PAL",
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
            env: "stage",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/trad"
          },
          {
            env: "live",
            renderer: "N/A",
            path: "articles/c3xd4x9prgyo/trad"
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
          allEnvironments = pageType.environments.filter(
            environmentConfig => environmentConfig.env === params.env
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

const getProgress = value => {
  return `<progress min="0" max="100" value="${value}"></progress><span> ${value}% </span>`;
}

const getSimorghStats = () => {
  let liveRadioServices = 0;
  let homePageServices = 0;
  let mapPageServices = 0;
  let articlePageServices = 0;

  let simorghLiveRadio = 0;
  let simorghHomePage = 0;
  let simorghMapPage = 0;
  let simorghArticlePage = 0;

  const distinctServices = [];
  const map = new Map();
  services.forEach(service => {
    if (!map.has(service.service)) {
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
          }
        }
      });
    });
  });

  document.getElementById(
    "Simorgh_liveRadio"
  ).innerHTML = getProgress(Math.round((simorghLiveRadio / liveRadioServices) * 100));

  document.getElementById(
    "Simorgh_MAP"
  ).innerHTML = getProgress(Math.round((simorghMapPage / mapPageServices) * 100));

  document.getElementById(
    "Simorgh_home"
  ).innerHTML = getProgress(Math.round((simorghHomePage / homePageServices) * 100));

  document.getElementById(
    "Simorgh_article"
  ).innerHTML = getProgress(Math.round((simorghArticlePage / articlePageServices) * 100));
};

const loadData = async () => {
  checkAllPages();
  getSimorghStats();
};
