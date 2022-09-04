const axios = require("axios");
// const baseUri = "https://api-memory-stack.herokuapp.com/api/";
const baseUri = "https://mstak.tech/api/";

async function postRequest(endpoint, data) {
  return axios.post(baseUri + endpoint, data);
}

async function getRequestSecure(endpoint, jwt) {
  return axios.get(baseUri + endpoint, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
}

async function postRequestSecure(endpoint, data, jwt) {
  return axios.post(baseUri + endpoint, data, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
}

module.exports = { postRequest, postRequestSecure, getRequestSecure };
