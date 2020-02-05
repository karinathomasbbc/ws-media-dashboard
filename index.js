const PASS = "&#9989;";
const FAIL = (message = "") => `<span title="Error${message}">&#10060;</span>`;

const PAGE_PASS = (platform = "Canonical") =>
  `<span title="${platform} Page OK">${PASS}</span>`;

const MEDIA_PASS = (platform = "Canonical") =>
  `<span title="${platform} Media OK">${PASS}</span>`;

const getSimorghPageStatus = (id, platform = "Canonical") => {
  return isSimorghPage(id)
    ? PAGE_PASS(platform)
    : FAIL(`:${platform} Page is not rendered by Simorgh`);
};

const getPALPageStatus = id => {
  return isPALPage(id)
    ? PAGE_PASS("PAL")
    : FAIL(": Page is not rendered by PAL");
};

const getElementId = (service, env, pageType, suffix) => {
  const elementId = `${service}_${env}_${pageType}_${suffix}`;
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

  return mediaHTML !== null
    ? MEDIA_PASS(platform)
    : FAIL(`- no media on ${platform}`);
};

const setStatus = async (service, pageType, environment) => {
  const { env, path, renderer } = environment;
  const { type, category } = pageType;
  const elementId = getElementId(service, env, type, "status");
  const canonicalUrl = getUrl(service, env, path);

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

    let innerHTML = canonicalPageStatus + canonicalMediaStatus;

    if (ampPageStatus) {
      innerHTML += `<br>${ampPageStatus}${ampMediaStatus}`;
    }

    element.innerHTML = innerHTML;
  }
};

const setRenderer = (service, pageType, environment) => {
  const { env, path, renderer } = environment;

  if (renderer !== "") {
    const elementId = getElementId(service, env, pageType, "renderer");
    const url = getUrl(service, env, path);
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<a target="_blank" href="${url}">${renderer
        .substring(0, 3)
        .toUpperCase()}</a>`;
    }
  }
};

const setPageType = (service, pageType) => {
  const elementId = `${service}_${pageType}`;
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
            renderer: "PAL",
            path: "news-49562667"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "news-49562667"
          },
          {
            env: "live",
            renderer: "PAL",
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
      }
    ]
  },
  {
    service: "cymrufyw",
    pageTypes: []
  },
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
            renderer: "PAL",
            path: "media-49502679"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "media-49502679"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "media-51099136"
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
            renderer: "PAL",
            path: "news-48422241"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "news-48422241"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "news-48422241"
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
            renderer: "PAL",
            path: "india-48062804"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "india-48062804"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "india-51095482"
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
      }
    ]
  },
  {
    service: "naidheachdan",
    pageTypes: []
  },
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
      }
    ]
  },
  {
    service: "news",
    pageTypes: []
  },
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
            renderer: "PAL",
            path: "international-49567825"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "international-49567825"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "india-51106988"
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
      }
    ]
  },
  {
    service: "scotland",
    pageTypes: []
  },
  {
    service: "serbian/cyr",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "svet-51052616"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "svet-51052616"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "svet-51052616"
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
      }
    ]
  },
  {
    service: "serbian/lat",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "svet-51096369"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "svet-51096369"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "svet-51096369"
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
            renderer: "PAL",
            path: ""
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
            renderer: "PAL",
            path: "india-49647976"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "india-49647976"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "india-49647976"
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
            renderer: "PAL",
            path: ""
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
      }
    ]
  },
  {
    service: "ukchina/simp",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "51085214"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "51085214"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "51085214"
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
      }
    ]
  },
  {
    service: "ukchina/trad",
    pageTypes: [
      {
        type: "MAP",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "51085214"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "51085214"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "51085214"
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
      }
    ]
  },
  {
    service: "zhongwen/simp",
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "bbc_cantonese_radio/liveradio"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "bbc_cantonese_radio/liveradio"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "bbc_cantonese_radio/liveradio"
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
            path: "chinese-news-51088031"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "chinese-news-51088031"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "chinese-news-51088031"
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
      }
    ]
  },
  {
    service: "zhongwen/trad",
    pageTypes: [
      {
        type: "liveRadio",
        category: "media",
        environments: [
          {
            env: "test",
            renderer: "PAL",
            path: "bbc_cantonese_radio/liveradio"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "bbc_cantonese_radio/liveradio"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "bbc_cantonese_radio/liveradio"
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
            path: "chinese-news-51088031"
          },
          {
            env: "stage",
            renderer: "PAL",
            path: "chinese-news-51088031"
          },
          {
            env: "live",
            renderer: "PAL",
            path: "chinese-news-51088031"
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
          const serviceName = service.service;
          const page = pageType.type;
          const { env, renderer } = environment;

          if (environment.renderer !== "") {
            setPageType(serviceName, page);
            setStatus(serviceName, pageType, environment);
            setRenderer(serviceName, page, environment);
          }
        });
      });
    });
  } catch (e) {
    //Nothing for the moment
  }
};

const getSimorghStats = () => {};

const loadData = async () => {
  checkAllPages();
  getSimorghStats();
};
