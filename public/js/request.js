const sendGETRequest = function(url, callback) {
  fetch(url, { method: 'GET' })
    .then((response) => response.json())
    .then(callback);
};

const handleRedirectedRequest = function(url) {
  fetch(url, { method: 'GET' }).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
  });
};

const sendPOSTRequest = function(url, postData, callback) {
  const requestOptions = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(postData),
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then(callback);
};
