import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // basically will throw an error if the request takes too long

    const data = await res.json();

    // if we want to manually handle an error, we do this. Even if the api url is something random, a response will still be returned, an so will a res.json(). If the api call didn't work, there is an 'ok' property in the response variable that will be false if the call didn't work, so we can actually use this to check if it worked or not.
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // this becomes the resolved value of the promise that is returned from the getJSON() function
  } catch (err) {
    throw err; // this propogates the error, so that if there is an error, the promise returned by this function rejects and we can handle it in the model script. If we dont do this, the promise here will still be fulfilled
  }
};

/*
export const getJSON = async function (url) {};

// NEW: HOW TO SEND DATA TO API USING THE FETCH FUNCTION
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
