var fs = require("fs");

function callback(err) {}

const login = (username, password) => {
  jwt = "kjrhkl4h23k4v23l4v24";

  //on successful login
  const toWrite = {
    username: username,
    jwt: jwt,
  };
  fs.writeFile(
    "./data/local/credentials.json",
    JSON.stringify(toWrite),
    "utf8",
    callback
  );
};
const logout = () => {
  //on successful logout
  fs.writeFile("./data/local/credentials.json", "", "utf8", callback);
};
const startDay = (text) => {};

const fetchLogs = () => {};
const fetchRank = () => {};

const changeAbout = (text) => {};
const pushLog = (log) => {};

module.exports = { logout, login };
