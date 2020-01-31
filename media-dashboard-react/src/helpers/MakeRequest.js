const handleResponse = response => {
  let text = null;

  try {
    if (response.ok) {
      text = response.text();
    }
  } catch (e) {
    console.log("ERROR", e);
  }
};

const makeRequest = url => {
  const prefix = "http://localhost:8080/";
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

export default makeRequest;
